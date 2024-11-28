package handler

import "cse-question-bank/internal/module/department/usecase"

type DepartmentHandler interface {

}

type departmentHandlerImpl struct {
	departmentUsecase usecase.DepartmentUsecase
}

func NewDepartmentHandler(departmentUsecase usecase.DepartmentUsecase) DepartmentHandler {
	return &departmentHandlerImpl{
		departmentUsecase: departmentUsecase,
	}
}