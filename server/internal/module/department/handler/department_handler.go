package handler

import (
	"cse-question-bank/internal/module/department/usecase"

	"github.com/gin-gonic/gin"
)

type DepartmentHandler interface {
	CreateDepartment(c *gin.Context)
	DeleteDepartment(c *gin.Context)
	UpdateDepartment(c *gin.Context)
	GetAllDepartments(c *gin.Context)
	GetDepartmentByCode(c *gin.Context)
}

type departmentHandlerImpl struct {
	departmentUsecase usecase.DepartmentUsecase
}

func NewDepartmentHandler(departmentUsecase usecase.DepartmentUsecase) DepartmentHandler {
	return &departmentHandlerImpl{
		departmentUsecase: departmentUsecase,
	}
}
