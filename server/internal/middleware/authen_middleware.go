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
		// Check Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.ResponseError(c, errors.ErrUnauthorized())
			c.Abort() // Stop further processing
			return
		}

		// Check Bearer prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			response.ResponseError(c, errors.ErrUnauthorized())
			c.Abort() // Stop further processing
			return
		}

		// Validate token
		secretKey := os.Getenv("JWT_SECRET_ACCESS_KEY")
		token, err := jwt.VerifyToken(tokenString, secretKey)
		if err != nil {
			response.ResponseError(c, errors.ErrUnauthorized())
			c.Abort() // Stop further processing
			return
		}

		// Set user information in the context
		c.Set("userId", token.UserID.String())
		c.Set("userRole", token.Role)
		// Proceed to the next middleware or handler
		c.Next()
	}
}
