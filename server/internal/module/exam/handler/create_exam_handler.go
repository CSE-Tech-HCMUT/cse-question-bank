package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/exam/model/req"

	"github.com/gin-gonic/gin"
)

//	CreateExam godoc
//
//	@Summary		Create a exam
//	@Description	Create a exam
//	@Tags			Exam
//	@Accept			json
//	@Produce		json
//	@Param			CreateExamRequest	body		req.CreateExamRequest	true	"CreateExamRequest JSON"
//	@Success		200	{object}	response.SuccessResponse{data=exam_res.ExamResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/exam [post]
func (h *examHandlerImpl) CreateExam(c *gin.Context) {
	var request req.CreateExamRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.examUsecase.CreateExam(c, request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
