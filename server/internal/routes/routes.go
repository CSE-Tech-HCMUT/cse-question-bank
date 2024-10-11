package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Route struct {
	Method  string
	Path    string
	Handler gin.HandlerFunc
}

func RegisterRoutes(db *gorm.DB) http.Handler {
	r := gin.Default()

	// domainName := os.Getenv("DOMAIN_NAME")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		initLatexCompileGroupRoutes(db, api)
		iniQuestionGroupRoutes(db, api)
		initTagGroupRoutes(db, api)
		iniTagOptionGroupRoutes(db, api)
	}

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