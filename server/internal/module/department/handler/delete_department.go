package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *departmentHandlerImpl) DeleteDepartment(c *gin.Context) {
	paramCode := c.Param("code")

	err := h.departmentUsecase.DeleteDepartment(c, paramCode)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", nil)
}
