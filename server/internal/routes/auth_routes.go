package routes

import (
	"cse-question-bank/internal/module/auth/handler"
	"cse-question-bank/internal/module/auth/usecase"
	"cse-question-bank/internal/module/user/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initAuthGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	userRepository := repository.NewUserRepository(db)
	authUsecase := usecase.NewAuthUsecase(userRepository)
	authHandler := handler.NewAuthHandler(authUsecase)
	authRoutes := api.Group("/auth")
	{
		addGroupRoutes(authRoutes, getAuthRoutes(authHandler))
	}
}

func getAuthRoutes(h handler.AuthHandler) []Route {
	return []Route{
		{
			Method:  "POST",
			Path:    "/register",
			Handler: h.RegisterAccount,
		},
		{
			Method:  "POST",
			Path:    "/login",
			Handler: h.Login,
		},
	}
}
