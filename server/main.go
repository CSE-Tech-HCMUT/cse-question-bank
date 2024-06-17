package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	// test
	router := gin.Default()
	router.Run(":8080")
}
