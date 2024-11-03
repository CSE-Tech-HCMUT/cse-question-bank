package routes

import (
	"cse-question-bank/internal/module/question/handler"
	"cse-question-bank/internal/module/question/repository"
	"cse-question-bank/internal/module/question/usecase"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func iniQuestionGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	questionRepository := repository.NewQuestionRepository(db)
	questionUsecase := usecase.NewQuestionUsecase(questionRepository)
	questionHandler := handler.NewQuestionHandler(questionUsecase)
	questionRoutes := api.Group("/questions")
	{
		addGroupRoutes(questionRoutes, getQuestionRoutes(questionHandler))
	}
}

func getQuestionRoutes(h handler.QuestionHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateQuestion,
		},
		{
			Method: "DELETE",
			Path: "/:id",
			Handler: h.DeleteQuestion,
		},
		{
			Method: "PUT",
			Path: "/:id",
			Handler: h.EditQuestion,
		},
		{
			Method: "GET",
			Path: "/:id",
			Handler: h.GetQuestion,
		},
		{
			Method: "GET",
			Path: "",
			Handler: h.GetAllQuestions,
		},
	}
}
