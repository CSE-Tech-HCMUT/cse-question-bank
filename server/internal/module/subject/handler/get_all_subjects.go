package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *subjectHandlerImpl) GetAllSubjects(c *gin.Context) {
	res, err := h.subjectUsecase.GetAllSubjects(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}