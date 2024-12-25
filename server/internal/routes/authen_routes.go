package routes

import (
	"cse-question-bank/internal/module/authen/handler"
	"cse-question-bank/internal/module/authen/usecase"
	"cse-question-bank/internal/module/user/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func initAuthenGroupRoutes(db *gorm.DB, api *gin.RouterGroup) {
	userRepository := repository.NewUserRepository(db)
	authenUsecase := usecase.NewAuthenUsecase(userRepository)
	authenHandler := handler.NewAuthenHandler(authenUsecase)
	authRoutes := api.Group("/authen")
	{
		addGroupRoutes(authRoutes, getAuthenRoutes(authenHandler))
	}
}

func getAuthenRoutes(h handler.AuthenHandler) []Route {
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
