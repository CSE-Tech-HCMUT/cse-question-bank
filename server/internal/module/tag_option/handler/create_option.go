package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/tag_option/model/entity"
	"cse-question-bank/internal/module/tag_option/model/req"

	"github.com/gin-gonic/gin"
)

func (h optionHandlerImpl) CreateOption(c *gin.Context) {
	var request req.CreateOptionRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	err := h.optionUsecase.CreateOption(c, &entity.Option{Name: request.Name})
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}