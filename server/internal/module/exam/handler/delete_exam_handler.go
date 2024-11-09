package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

//	DeleteExam godoc
//
//	@Summary		Delete a exam
//	@Description	Delete a exam
//	@Tags			Exam
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Exam Id"
//	@Success		200	{object}	response.SuccessResponse{data=interface{}}
//	@Failure		400 {object} 	response.ErrorResponse
//	@Router			/exams/{id} [delete]
func (h *examHandlerImpl) DeleteExam(c *gin.Context) {
	examId := c.Param("id")
	examUUID, err := uuid.Parse(examId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	err = h.examUsecase.DeleteExam(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}