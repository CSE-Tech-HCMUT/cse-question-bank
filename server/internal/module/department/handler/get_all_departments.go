package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

func (h *departmentHandlerImpl) GetAllDepartments(c *gin.Context) {
	departmentResList, err := h.departmentUsecase.GetAllDepartments(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", departmentResList)
}