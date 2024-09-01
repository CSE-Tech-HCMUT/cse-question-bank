package server

import (
	"cse-question-bank/internal/database"
	"cse-question-bank/internal/routes"
	"cse-question-bank/pkg/logger"
	"fmt"
	"log/slog"
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

	opts := &slog.HandlerOptions{
		AddSource: true,
	}
	newLogger := slog.New(logger.NewHandler(opts))
	slog.SetDefault(newLogger)

	NewServer := &Server{
		port: port,
		db:   database.InitDatabase(),
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", NewServer.port),
		Handler: routes.RegisterRoutes(NewServer.db.GetDB()),
	}

	return server
}
