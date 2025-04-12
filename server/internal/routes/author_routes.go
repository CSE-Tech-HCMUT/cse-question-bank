package routes

import (
	"cse-question-bank/internal/core/casbin"

	"cse-question-bank/internal/module/author/handler"
	"cse-question-bank/internal/module/author/usecase"

	"github.com/gin-gonic/gin"
)

func initAuthorGroupRoutes(casbin *casbin.CasbinService, api *gin.RouterGroup) {
	authUsecase := usecase.NewAuthorUsecase(casbin)
	authHandler := handler.NewAuthorHandler(authUsecase)
	authRoutes := api.Group("/author")
	{
		addGroupRoutes(authRoutes, getAuthRoutes(authHandler))
	}
}

func getAuthRoutes(h handler.AuthorHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "/add-policy",
			Handler: h.AddPolicy,
		},
		{
			Method:  "POST",
			Path:    "/assign-role",
			Handler: h.AssignRole,
		},
		{
			Method:  "GET",
			Path:    "/get-all-policies",
			Handler: h.GetAllPolicies,
		},
		{
			Method:  "GET",
			Path:    "/get-all-roles",
			Handler: h.GetAllRoles,
		},
		{
			Method:  "GET",
			Path:    "/get-grouping-policy",
			Handler: h.GetGroupingPolicy,
		},
	}
}
