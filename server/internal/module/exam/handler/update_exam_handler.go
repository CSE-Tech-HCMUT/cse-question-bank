package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/exam/model/req"

	"github.com/gin-gonic/gin"
)

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
