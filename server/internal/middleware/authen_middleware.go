package middleware

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/pkg/jwt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// check Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.ResponseError(c, errors.ErrUnauthorized())
			return
		}

		// check Bearer prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			response.ResponseError(c, errors.ErrUnauthorized())
			return
		}

		// validate token
		secretKey := os.Getenv("JWT_SECRET_ACCESS_KEY")
		token, err := jwt.VerifyToken(tokenString, secretKey)
		if err != nil {
			response.ResponseError(c, errors.ErrUnauthorized())
			return
		}

		c.Set("userId", token.UserID)
		c.Set("userRole", token.Role)
		c.Next()
	}
}
