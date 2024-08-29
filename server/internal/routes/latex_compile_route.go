package routes

import (
	"cse-question-bank/internal/module/latex_compiler/handler"
	"cse-question-bank/internal/module/latex_compiler/usecase"

	"github.com/gin-gonic/gin"
)

func initLatexCompileGroupRoutes(api *gin.RouterGroup) {
	latexCompileUsecase := usecase.NewLatexCompiler()
	latexCompileHandler := handler.NewLatexCompilerHandler(latexCompileUsecase)

	latexComileRoutes := api.Group("/latex-compile")
	{
		addGroupRoutes(latexComileRoutes, getLatexCompileRoutes(latexCompileHandler))
	}
}

func getLatexCompileRoutes(h handler.LatexCompilerHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CompileHandler,
		},
	}
}
