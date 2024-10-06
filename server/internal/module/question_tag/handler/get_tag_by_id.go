package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h tagHandlerImpl) GetTagById(c *gin.Context) {
	paramId := c.Param("id")
	tagId, err := strconv.Atoi(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	tag, err := h.tagUsecase.GetTag(c, tagId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tag)
}
