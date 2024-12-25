package usecase

import "context"

func (u *authorUsecaseImpl) GetAllPolicies(ctx context.Context) ([][]string, error) {
	return u.casbinService.ListPolicies()
}