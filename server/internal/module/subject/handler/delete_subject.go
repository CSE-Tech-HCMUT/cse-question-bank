package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *subjectHandlerImpl) DeleteSubject(c *gin.Context) {
	paramId := c.Param("id")
	subjectId, err := uuid.Parse(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	err = h.subjectUsecase.DeleteSubject(c, subjectId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", nil)
}
