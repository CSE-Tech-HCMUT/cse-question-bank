package main

import (
	"cse-question-bank/internal/module/latex_compiler/handler"
	"cse-question-bank/internal/module/latex_compiler/usecase"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("can not read .env")
	}

	//server := server.InitServer()

	latexCompileUsecase := usecase.NewLatexCompiler()
	latexCompileHandler := handler.NewLatexCompilerHandler(latexCompileUsecase)
	router := gin.Default()
	router.GET("/pdf", latexCompileHandler.CompileHandler)
	// err = server.ListenAndServe()
	// if err != nil {
	// 	panic("cannot start server")
	// } else {
	// 	fmt.Print("server is running")
	// }
	router.Run(":8080")
}
