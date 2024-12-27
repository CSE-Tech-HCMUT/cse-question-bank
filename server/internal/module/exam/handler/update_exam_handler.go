package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/exam/model/req"

	"github.com/gin-gonic/gin"
)

//	UpdateExam godoc
//
//	@Summary		Update a exam
//	@Description	Update a exam
//	@Tags			Exam
//	@Accept			json
//	@Produce		json
//	@Param			UpdateExamRequest	body		req.UpdateExamRequest	true	"UpdateExamRequest JSON"
//	@Success		200	{object}	response.SuccessResponse{data=exam_res.ExamResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/exams [put]
func (h *examHandlerImpl) UpdateExam(c *gin.Context) {
	var request req.UpdateExamRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	exam, err := h.examUsecase.UpdateExam(c, &request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", exam)
}
