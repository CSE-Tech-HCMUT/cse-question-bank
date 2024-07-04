package main

import (
	"cse-question-bank/internal/server"
	"fmt"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("can not read .env")
	}

	server := server.InitServer()

	err = server.ListenAndServe()
	if err != nil {
		panic("cannot start server")
	} else {
		fmt.Print("server is running")
	}
}
