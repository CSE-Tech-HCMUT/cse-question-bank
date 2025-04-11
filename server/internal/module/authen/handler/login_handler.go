package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/authen/model/req"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Login godoc
//
// @Summary		User login, return access token to client.
// @Description	Access token is used to access protected resources.
// @Tags			Policy
// @Accept			json
// @Produce		json
// @Param			LoginRequest	body		req.LoginRequest	true	"LoginRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=string}
// @Failure	400 {object} response.ErrorResponse
// @Router			/authen/login [post]
func (h *authHandlerImpl) Login(c *gin.Context) {
	var request req.LoginRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	accessToken, refreshToken, err := h.authUsecase.Login(c, &request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   true,
		Path:     "/refresh",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	})

	response.ReponseSuccess(c, "ok", accessToken)
}
