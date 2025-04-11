package usecase

import "context"

func (u *authorUsecaseImpl) GetGroupingPolicy(ctx context.Context) ([][]string, error) {
	return u.casbinService.GetGroupingPolicy()
}
