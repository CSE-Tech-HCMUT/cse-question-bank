package usecase

import (
	"context"
	"cse-question-bank/internal/module/department/model/req"
	res "cse-question-bank/internal/module/department/model/res"
)

func (u *departmentUsecaseImpl) UpdateDepartment(ctx context.Context, request req.UpdateDepartmentRequest) (*res.DepartmentResponse, error) {
	department := request.ToEntity()
	err := u.departmentRepository.Update(ctx, nil, department)
	if err != nil {
		return nil, err
	}

	return res.EntityToDepartmentResponse(department), nil
}