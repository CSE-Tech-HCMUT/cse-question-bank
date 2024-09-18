package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"

	"github.com/gin-gonic/gin"
)

func (h *questionHandlerImpl) EditQuestion(c *gin.Context) {
	var request req.EditQuestionRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.questionUsecase.EditQuestion(c, req.EditReqToQuestionModel(&request)); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
