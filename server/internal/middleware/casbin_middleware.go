package middleware

import (
	"cse-question-bank/internal/core/casbin"

	"github.com/gin-gonic/gin"
)

func CasbinMiddleware(casbinService *casbin.CasbinService) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("casbinService", casbinService)
		c.Next()
	}
}
