package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *subjectHandlerImpl) GetSubjectById(c *gin.Context) {
	paramId := c.Param("id")
	subjectId, err := uuid.Parse(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.subjectUsecase.GetSubjectById(c, subjectId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}