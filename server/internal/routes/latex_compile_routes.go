package routes

import (
	er "cse-question-bank/internal/module/exam/repository"
	qr "cse-question-bank/internal/module/question/repository"
	"cse-question-bank/internal/module/latex_compiler/handler"
	"cse-question-bank/internal/module/latex_compiler/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initLatexCompileGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	examRepository := er.NewExamRepository(db)
	questionRepository := qr.NewQuestionRepository(db)
	latexCompileUsecase := usecase.NewLatexCompiler(examRepository, questionRepository)
	latexCompileHandler := handler.NewLatexCompilerHandler(latexCompileUsecase)

	latexComileRoutes := api.Group("/compile-latex")
	{
		addGroupRoutes(latexComileRoutes, getLatexCompileRoutes(latexCompileHandler))
	}
}

func getLatexCompileRoutes(h handler.LatexCompilerHandler) []Route {
	return []Route{
		{
			Method:  "GET",
			Path:    "/questions/:id",
			Handler: h.CompileQuestion,
		},
		{
			Method:  "GET",
			Path:    "/exams/:id",
			Handler: h.CompileExam,
		},
	}
}
