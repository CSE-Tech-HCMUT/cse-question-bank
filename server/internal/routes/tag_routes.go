package routes

import (
	"cse-question-bank/internal/module/tag/handler"
	"cse-question-bank/internal/module/tag/repository"
	"cse-question-bank/internal/module/tag/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initTagGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	tagRepository := repository.NewTagRepository(db)
	tagUsecase := usecase.NewTagUsecase(tagRepository)
	tagHandler := handler.NewTagHandler(tagUsecase)
	tagRoutes := api.Group("/tags")
	{
		addGroupRoutes(tagRoutes, getTagRoutes(tagHandler))
	}
}

func getTagRoutes(h handler.TagHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateTag,
		},
		{
			Method: "DELETE",
			Path: "/:id",
			Handler: h.DeleteTag,
		},
		{
			Method: "PUT",
			Path: "",
			Handler: h.UpdateTag,
		},
		{
			Method: "GET",
			Path: "/:id",
			Handler: h.GetTagById,
		},
		{
			Method: "GET",
			Path: "",
			Handler: h.GetAllTags,
		},
	}
}
