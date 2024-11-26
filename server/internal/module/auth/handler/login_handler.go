package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/auth/model/req"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

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
