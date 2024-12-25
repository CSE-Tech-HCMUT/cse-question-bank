package usecase

import "context"

func (u *policyUsecaseImpl) GetAllPolicies(ctx context.Context) ([][]string, error) {
	return u.casbinService.ListPolicies()
}