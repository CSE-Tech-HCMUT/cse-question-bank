package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h tagHandlerImpl) GetAllTags(c *gin.Context) {
	tagList, err := h.tagUsecase.GetAllTag(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tagList)
}
