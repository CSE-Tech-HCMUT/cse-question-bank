package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"

	"github.com/gin-gonic/gin"
)

func (h *questionHandlerImpl) CreateQuestion(c *gin.Context) {
	var request req.CreateQuestionRequest

	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}
	data, err := h.questionUsecase.CreateQuestion(c, req.CreateReqToQuestionModel(&request))

	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", data)
}
