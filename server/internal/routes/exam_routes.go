package routes

import (
	"cse-question-bank/internal/module/exam/handler"
	er "cse-question-bank/internal/module/exam/repository"
	"cse-question-bank/internal/module/exam/usecase"
	qr "cse-question-bank/internal/module/question/repository"
	tr "cse-question-bank/internal/module/tag/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initExamGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	questionRepository := qr.NewQuestionRepository(db)
	examRepository := er.NewExamRepository(db)
	tagRepository := tr.NewTagRepository(db)
	examUsecase := usecase.NewExamUsecase(tagRepository, questionRepository, examRepository)
	examHandler := handler.NewExamHandler(examUsecase)
	examRoutes := api.Group("/exams")
	{
		addGroupRoutes(examRoutes, getExamRoutes(examHandler))
	}
}

func getExamRoutes(h handler.ExamHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "/:id/generate-auto",
			Handler: h.GenerateExamAuto,
		},
		{
			Method:  "GET",
			Path:    "/:id/get-filtered-questions",
			Handler: h.GetExamFilteredQuestionsList,
		},
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateExam,
		},
		{
			Method:  "GET",
			Path:    "/:id",
			Handler: h.GetExam,
		},
		{
			Method:  "PUT",
			Path:    "",
			Handler: h.UpdateExam,
		},
		{
			Method:  "DELETE",
			Path:    "/:id",
			Handler: h.DeleteExam,
		},
		{
			Method:  "GET",
			Path:    "",
			Handler: h.GetAllExams,
		},
		{
			Method:  "POST",
			Path:    "/shuffle",
			Handler: h.ShuffleExam,
		},
	}
}
