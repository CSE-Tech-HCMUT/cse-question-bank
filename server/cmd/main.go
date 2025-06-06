package main

import (
	"cse-question-bank/internal/server"

	"github.com/joho/godotenv"
)


//	@title			Swagger Example API
//	@version		1.0
//	@description	This is a sample server celler server.
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@host		localhost:8080
//	@BasePath	/api

//	@securityDefinitions.basic	BasicAuth

//	@externalDocs.description	OpenAPI
//	@externalDocs.url			https://swagger.io/resources/open-api/
func main() {
	err := godotenv.Load()
	if err != nil {
		panic("can not read .env")
	}

	server := server.InitServer()

	err = server.ListenAndServe()
	if err != nil {
		panic("cannot start server")
	}
}
