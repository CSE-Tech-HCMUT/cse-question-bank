package routes

import (
	"cse-question-bank/internal/module/subject/handler"
	"cse-question-bank/internal/module/subject/usecase"
	"cse-question-bank/internal/module/subject/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initSubjectGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	subjectRepository := repository.NewSubjectRepository(db)
	subjectUsecase := usecase.NewSubjectUsecase(subjectRepository)
	subjectHandler := handler.NewSubjectHandler(subjectUsecase)
	subjectRoutes := api.Group("/subjects")
	{
		addGroupRoutes(subjectRoutes, getSubjectRoutes(subjectHandler))
	}
}

func getSubjectRoutes(h handler.SubjectHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateSubject,
		},
		{
			Method: "DELETE",
			Path: "/:id",
			Handler: h.DeleteSubject,
		},
		{
			Method: "PUT",
			Path: "/:id",
			Handler: h.UpdateSubject,
		},
		{
			Method: "GET",
			Path: "/:code",
			Handler: h.GetSubjectById,
		},
		{
			Method: "GET",
			Path: "",
			Handler: h.GetAllSubjects,
		},
	}
}
