package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ReponseSuccess(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, SuccessResponse{
		Message: message,
		Data: data,
	})
}
