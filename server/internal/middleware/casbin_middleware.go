package middleware

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/pkg/jwt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func CasbinMiddleware(casbinService *casbin.CasbinService) gin.HandlerFunc {
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

		method := c.Request.Method
		path := c.Request.URL.Path

		// check permission in casbin
		allowed, err := casbinService.Enforce(token.UserID.String(), method, path)
		if err != nil {
			response.ResponseError(c, errors.NewDomainError(500, nil, "error with auth", "AUTH_ERROR"))
			return
		}

		if !allowed {
			response.ResponseError(c, errors.ErrUnauthorized())
			return
		}
		
		c.Set("userId", token.UserID)
		c.Set("userRole", token.Role)
		c.Next()
	}
}
