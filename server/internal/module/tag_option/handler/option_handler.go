package handler

import (
	"cse-question-bank/internal/module/tag_option/usecase"

	"github.com/gin-gonic/gin"
)

type OptionHandler interface {
	GetUsedOption(c *gin.Context)
	DeleteOption(c *gin.Context)
	CreateOption(c *gin.Context)
}

type optionHandlerImpl struct {
	optionUsecase usecase.OptionUsecase
}

func NewOptionHandler(optionUsecase usecase.OptionUsecase) OptionHandler {
	return &optionHandlerImpl{
		optionUsecase: optionUsecase,
	}
}