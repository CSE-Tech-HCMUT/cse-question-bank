package usecase

import (
	"context"
	"cse-question-bank/internal/module/department/model/req"
	res "cse-question-bank/internal/module/department/model/res"
	"cse-question-bank/internal/module/department/repository"
)

type DepartmentUsecase interface {
	CreateDepartment(ctx context.Context, request *req.CreateDepartmentRequest) (*res.DepartmentResponse, error)
	DeleteDepartment(ctx context.Context, code string) error
	GetAllDepartments(ctx context.Context) ([]*res.DepartmentResponse, error)
	GetDepartmentByCode(ctx context.Context, code string) (*res.DepartmentResponse, error)
	UpdateDepartment(ctx context.Context, request req.UpdateDepartmentRequest) (*res.DepartmentResponse, error)
}

type departmentUsecaseImpl struct {
	departmentRepository repository.DepartmentRepository
}

func NewDepartmentUsecase(departmentRepository repository.DepartmentRepository) DepartmentUsecase {
	return &departmentUsecaseImpl{
		departmentRepository: departmentRepository,
	}
}
