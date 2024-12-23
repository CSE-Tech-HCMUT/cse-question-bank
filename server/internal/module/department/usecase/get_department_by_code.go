package usecase

import (
	"context"
	res "cse-question-bank/internal/module/department/model/res"
)

func (u *departmentUsecaseImpl) GetDepartmentByCode(ctx context.Context, code string) (*res.DepartmentResponse, error) {
	departments, err := u.departmentRepository.Find(ctx, nil, map[string]interface{}{
		"code": code,
	})

	if err != nil {
		return nil, err
	}

	return res.EntityToDepartmentResponse(departments[0]), nil
}