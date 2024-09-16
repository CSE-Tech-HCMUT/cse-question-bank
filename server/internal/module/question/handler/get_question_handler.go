package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *questionHandlerImpl) GetQuestion(c *gin.Context) {
	questionId := c.Param("id")

	res, err := h.questionUsecase.GetQuestion(c, questionId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", res)
}