package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetExam godoc
//
// @Summary		Get exam
// @Description	Get exam
// @Tags			Exam
// @Accept			json
// @Param			id	path		string	true	"Exam Id"
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=exam_res.FilterQuestionsList}
// @Failure	400 {object} response.ErrorResponse
// @Router			/exams/{id} [get]
func (h *examHandlerImpl) GetExam(c *gin.Context) {
	examId := c.Param("id")
	examUUID, err := uuid.Parse(examId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	exam, err := h.examUsecase.GetExam(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", exam)
}
