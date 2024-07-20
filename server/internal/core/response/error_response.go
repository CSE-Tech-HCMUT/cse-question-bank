package response

import (
	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	ErrorKey     string `json:"error_key"`
	ErrorMessage string `json:"error_message"`
}

type DomainError interface {
	ErrorKey() string
	ErrorMessage() string
	Error() error
}

func ResponseError(c *gin.Context, code int, err ErrorResponse) {
	c.JSON(code, ErrorResponse{
		ErrorKey:     err.ErrorKey,
		ErrorMessage: err.ErrorMessage,
	})
}
