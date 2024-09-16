package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *questionHandlerImpl) DeleteQuestion(c *gin.Context) {
	questionId := c.Param("id")

	if err := h.questionUsecase.DeleteQuestion(c, questionId); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}