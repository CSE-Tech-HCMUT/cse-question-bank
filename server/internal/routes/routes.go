package routes

import (
	"net/http"

	_ "cse-question-bank/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

type Route struct {
	Method  string
	Path    string
	Handler gin.HandlerFunc
}

func RegisterRoutes(db *gorm.DB) http.Handler {
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Adjust as needed
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Group API routes
	api := r.Group("/api")
	{
		initLatexCompileGroupRoutes(db, api)
		iniQuestionGroupRoutes(db, api)
		initTagGroupRoutes(db, api)
		iniTagOptionGroupRoutes(db, api)
	}

	// Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Handle OPTIONS requests for CORS preflight
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Status(http.StatusNoContent) // Respond with 204 No Content
	})

	return r
}

func addGroupRoutes(g *gin.RouterGroup, routes []Route) {
	for _, route := range routes {
		switch route.Method {
		case "GET":
			g.GET(route.Path, route.Handler)
		case "POST":
			g.POST(route.Path, route.Handler)
		case "PUT":
			g.PUT(route.Path, route.Handler)
		case "DELETE":
			g.DELETE(route.Path, route.Handler)
		}
	}
}
