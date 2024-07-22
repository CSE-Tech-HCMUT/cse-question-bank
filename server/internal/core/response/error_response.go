package response

import (
	"cse-question-bank/internal/core/errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	ErrorKey     string `json:"error_key"`
	ErrorMessage string `json:"error_message"`
}

func ResponseError(c *gin.Context, err errors.DomainError) {
	code := mappingHTTPStatusCode(errors.ErrorKey(err.ErrorKey()))
	c.JSON(code, ErrorResponse{
		ErrorKey:     string(err.ErrorKey()),
		ErrorMessage: err.ErrorMessage(),
	})
}

func mappingHTTPStatusCode(key errors.ErrorKey) int {
	switch key {
	case errors.ErrNotFound:
		return http.StatusNotFound
	case errors.ErrInvalidInput:
		return http.StatusBadRequest
	case errors.ErrInternalServer:
		return http.StatusInternalServerError
	default:
		return http.StatusInternalServerError
	}
}
