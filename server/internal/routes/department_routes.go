package routes

import (
	"cse-question-bank/internal/module/department/handler"
	"cse-question-bank/internal/module/department/usecase"
	"cse-question-bank/internal/module/department/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initDepartmentGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	departmentRepository := repository.NewDepartmentRepository(db)
	departmentUsecase := usecase.NewDepartmentUsecase(departmentRepository)
	departmentHandler := handler.NewDepartmentHandler(departmentUsecase)
	departmentRoutes := api.Group("/departments")
	{
		addGroupRoutes(departmentRoutes, getDepartmentRoutes(departmentHandler))
	}
}

func getDepartmentRoutes(h handler.DepartmentHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "",
			Handler: h.CreateDepartment,
		},
		{
			Method: "DELETE",
			Path: "/:id",
			Handler: h.DeleteDepartment,
		},
		{
			Method: "PUT",
			Path: "/:id",
			Handler: h.UpdateDepartment,
		},
		{
			Method: "GET",
			Path: "/:code",
			Handler: h.GetDepartmentByCode,
		},
		{
			Method: "GET",
			Path: "",
			Handler: h.GetAllDepartments,
		},
	}
}
