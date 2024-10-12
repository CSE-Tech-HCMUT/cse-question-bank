package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h tagHandlerImpl) DeleteTag(c *gin.Context) {
	paramId := c.Param("id")

	tagId, err := strconv.Atoi(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.tagUsecase.DeleteTag(c, tagId); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
