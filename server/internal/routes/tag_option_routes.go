package routes

import (
	tar "cse-question-bank/internal/module/tag_assignment/repository"
	"cse-question-bank/internal/module/tag_option/handler"
	tor "cse-question-bank/internal/module/tag_option/repository"
	"cse-question-bank/internal/module/tag_option/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func iniTagOptionGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	optionRepository := tor.NewOptionRepository(db)
	tagAssignmentRepository := tar.NewTagAssignmentRepository(db)
	optionUsecase := usecase.NewOptionUsecase(optionRepository, tagAssignmentRepository)
	optionHandler := handler.NewOptionHandler(optionUsecase)
	questionRoutes := api.Group("/options")
	{
		addGroupRoutes(questionRoutes, getOptionRoutes(optionHandler))
	}
}

func getOptionRoutes(h handler.OptionHandler) []Route {
	return []Route{
		{
			Method:  "GET",
			Path:    "/:id/get-used",
			Handler: h.GetUsedOption,
		},
		{
			Method:  "DELETE",
			Path:    "/:id",
			Handler: h.DeleteOption,
		},
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateOption,
		},
	}
}
