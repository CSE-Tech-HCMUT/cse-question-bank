package handler

import (
	"cse-question-bank/internal/module/question_tag/usecase"

	"github.com/gin-gonic/gin"
)

type TagHandler interface {
	CreateTag(c *gin.Context)
	DeleteTag(c *gin.Context)
	GetAllTags(c *gin.Context)
	GetTagById(c *gin.Context)
	UpdateTag(c *gin.Context)
}

type tagHandlerImpl struct {
	tagUsecase usecase.TagUsecase
}

func NewTagHandler() TagHandler {
	return &tagHandlerImpl{}
}
