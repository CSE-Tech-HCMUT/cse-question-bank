package handler

import (
	"cse-question-bank/internal/module/author/usecase"

	"github.com/gin-gonic/gin"
)

type AuthorHandler interface {
	AddPolicy(c *gin.Context)
	AssignRole(c *gin.Context)
	GetAllPolicies(c *gin.Context)
	GetAllRoles(c *gin.Context)
	GetGroupingPolicy(c *gin.Context)
}

type authorHandlerImpl struct {
	authorUsecase usecase.AuthorUsecase
}

func NewAuthorHandler(authorUsecase usecase.AuthorUsecase) AuthorHandler {
	return &authorHandlerImpl{
		authorUsecase: authorUsecase,
	}
}
