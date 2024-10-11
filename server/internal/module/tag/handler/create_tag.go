package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	request "cse-question-bank/internal/module/tag/model/req"

	"github.com/gin-gonic/gin"
)

func (h tagHandlerImpl) CreateTag(c *gin.Context) {
	var req request.CreateTagRequest

	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	tagId, err := h.tagUsecase.CreateTag(c, *request.CreateTagReqToEntity(req))
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tagId)

}
