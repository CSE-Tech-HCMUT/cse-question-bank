package response

import (
	"cse-question-bank/internal/core/errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	ErrorKey     string `json:"errorKey"`
	ErrorMessage string `json:"errorMessage"`
}

func ResponseError(c *gin.Context, err error) {
	if domainErr, ok := err.(*errors.DomainError); ok {
		c.JSON(domainErr.StatusCode, ErrorResponse{
			ErrorKey:     domainErr.ErrorKey,
			ErrorMessage: domainErr.Message,
		})
		return
	}

	c.JSON(http.StatusInternalServerError, ErrorResponse{
		ErrorKey:     "InternalError",
		ErrorMessage: "An internal error occurred",
	})
}

// func mappingHTTPStatusCode(statusCode int) int {
// 	switch statusCode {
// 	case errors.ErrNotFound:
// 		return http.StatusNotFound
// 	case errors.ErrInvalidInput:
// 		return http.StatusBadRequest
// 	case errors.ErrInternalServer:
// 		return http.StatusInternalServerError
// 	default:
// 		return http.StatusInternalServerError
// 	}
// }
