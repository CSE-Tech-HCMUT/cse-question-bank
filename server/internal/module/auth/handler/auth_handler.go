package handler

import (
	"cse-question-bank/internal/module/auth/usecase"

	"github.com/gin-gonic/gin"
)

type AuthHandler interface {
	Login(c *gin.Context)
	RegisterAccount(c *gin.Context)
}

type authHandlerImpl struct {
	authUsecase usecase.AuthUsecase
}

func NewAuthHandler(authUsecase usecase.AuthUsecase) AuthHandler {
	return &authHandlerImpl{
		authUsecase: authUsecase,
	}
}