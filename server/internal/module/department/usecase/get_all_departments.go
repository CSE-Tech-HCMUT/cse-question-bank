package usecase

import (
	"context"
	res "cse-question-bank/internal/module/department/model/res"
)

func (u *departmentUsecaseImpl) GetAllDepartments(ctx context.Context) ([]*res.DepartmentResponse, error) {
	deparments, err := u.departmentRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	departmentResList := make([]*res.DepartmentResponse, 0)
	for _, department := range deparments {
		departmentRes := res.EntityToDepartmentResponse(department)

		departmentResList = append(departmentResList, departmentRes)
	}

	return departmentResList, nil
}