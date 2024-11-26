package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/auth/model/req"

	"github.com/gin-gonic/gin"
)

func (h *authHandlerImpl) RegisterAccount(c *gin.Context) {
	var request req.RegisterAccountRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	err := h.authUsecase.RegisterAccount(c, request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "register success", nil)
}
