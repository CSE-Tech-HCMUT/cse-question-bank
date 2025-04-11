package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/authen/model/req"

	"github.com/gin-gonic/gin"
)

// Register godoc
//
// @Summary		User register account to system.
// @Description	Register account to system.
// @Tags			Policy
// @Accept			json
// @Produce		json
// @Param			RegisterAccountRequest	body		req.RegisterAccountRequest	true	"RegisterAccountRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=string}
// @Failure	400 {object} response.ErrorResponse
// @Router			/authen/login [post]
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
