package server

import (
	"cse-question-bank/internal/database"
	"fmt"
	"net/http"
	"os"
	"strconv"
)

type Server struct {
	port int
	db   database.Service
}

func InitServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("SERVER_PORT"))
	NewServer := &Server{
		port: port,
		db:   database.InitDatabase(),
	}

	server := &http.Server{
		Addr: fmt.Sprintf(":%d", NewServer.port),
	}

	return server
}