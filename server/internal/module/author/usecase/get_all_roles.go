package usecase

import "context"

func (u *authorUsecaseImpl) GetAllRoles(ctx context.Context) ([]string, error) {
	roles, err := u.casbinService.GetAllRoles()
	if err != nil {
		return nil, err
	}

	return roles, nil
}
