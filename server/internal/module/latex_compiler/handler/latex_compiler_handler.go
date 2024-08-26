package handler

import (
	"cse-question-bank/internal/module/latex_compiler/usecase"

	"github.com/gin-gonic/gin"
)

type LatexCompilerHandler interface {
	CompileHandler(c *gin.Context)
}

type latexCompilerHandlerImpl struct {
	latexCompilerUsecase usecase.LatexCompilerUsecase
}

func NewLatexCompilerHandler(
	latexCompilerUsecase usecase.LatexCompilerUsecase,
) LatexCompilerHandler {
	return &latexCompilerHandlerImpl{
		latexCompilerUsecase: latexCompilerUsecase,
	}
}
