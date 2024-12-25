package usecase

import (
	"context"
	"cse-question-bank/internal/module/author/model/req"
	"errors"
)

func (u *authorUsecaseImpl) AssignRole(ctx context.Context, request *req.AssignRoleRequest) error {
	ok, err := u.casbinService.AddGroupingPolicy(request.UserId, request.Role)
	if err != nil {
		return err
	}

	if !ok {
		return errors.New("fail to assign role")
	}

	return nil
}
