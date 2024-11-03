package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/exam/model/req"

	"github.com/gin-gonic/gin"
)

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
