package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *departmentHandlerImpl) GetDepartmentByCode(c *gin.Context) {
	paramCode := c.Param("code")

	res, err := h.departmentUsecase.GetDepartmentByCode(c, paramCode)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
