package handler

import (
	"cse-question-bank/internal/module/authen/usecase"

	"github.com/gin-gonic/gin"
)

type AuthenHandler interface {
	Login(c *gin.Context)
	RegisterAccount(c *gin.Context)
}

type authHandlerImpl struct {
	authUsecase usecase.AuthenUsecase
}

func NewAuthenHandler(authUsecase usecase.AuthenUsecase) AuthenHandler {
	return &authHandlerImpl{
		authUsecase: authUsecase,
	}
}