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

	cb, err := casbin.NewCasbinService(db)
	if err != nil {
		panic(err)
	}
	if err := casbin.InitCasbinPolicy(cb, db); err != nil {
		panic("fail to init casbin policy")
	}

	// url := ginSwagger.URL("http://localhost:8080/swagger/doc.json")

	// domainName := os.Getenv("DOMAIN_NAME")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		initLatexCompileGroupRoutes(db, api)
		iniQuestionGroupRoutes(db, cb, api)
		initTagGroupRoutes(db, api)
		iniTagOptionGroupRoutes(db, api)
		initExamGroupRoutes(db, api)
		initAuthenGroupRoutes(db, api)
		initAuthorGroupRoutes(cb, api)
		initSubjectGroupRoutes(db, api)
		initDepartmentGroupRoutes(db, api)
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

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
