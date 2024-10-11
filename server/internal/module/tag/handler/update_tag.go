package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	request "cse-question-bank/internal/module/tag/model/req"

	"github.com/gin-gonic/gin"
)

func (h tagHandlerImpl) UpdateTag(c *gin.Context) {
	var req request.UpdateTagRequest
	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return 
	}

	err := h.tagUsecase.UpdateTag(c, *request.UpdateTagReqToEntity(req))
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
