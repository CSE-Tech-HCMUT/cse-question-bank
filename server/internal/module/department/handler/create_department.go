package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/department/model/req"

	"github.com/gin-gonic/gin"
)

func (h *departmentHandlerImpl) CreateDepartment(c *gin.Context) {
	var request req.CreateDepartmentRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.departmentUsecase.CreateDepartment(c, &request)
	if err != nil {
		response.ResponseError(c, err)
	}
	response.ReponseSuccess(c, "ok", res)
}
