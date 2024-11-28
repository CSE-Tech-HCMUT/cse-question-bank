package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/department/model/req"

	"github.com/gin-gonic/gin"
)

func (h *departmentHandlerImpl) UpdateDepartment(c *gin.Context) {
	var request req.UpdateDepartmentRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.departmentUsecase.UpdateDepartment(c, request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
