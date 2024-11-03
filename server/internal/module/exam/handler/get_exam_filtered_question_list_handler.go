package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *examHandlerImpl) GetExamFilteredQuestionsList(c *gin.Context) {
	examId := c.Param("id")
	examUUID := uuid.MustParse(examId)
	res, err := h.examUsecase.GetExamFilteredQuestionsList(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
