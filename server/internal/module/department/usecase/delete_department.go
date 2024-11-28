package usecase

import "context"

func (u *departmentUsecaseImpl) DeleteDepartment(ctx context.Context, code string) error {
	if err := u.departmentRepository.Delete(ctx, nil, map[string]interface{}{
		"code": code,
	}); err != nil {
		return err
	}

	return nil
}