package usecase

import (
	"context"
	"cse-question-bank/internal/module/author/model/req"
	"errors"
	"log/slog"
)

func (u *authorUsecaseImpl) AssignRole(ctx context.Context, request *req.AssignRoleRequest) error {
	ok, err := u.casbinService.AddGroupingPolicy(request.UserId.String(), request.Role)
	if err != nil {
		slog.Error("Error with assign role for userId", "error-message", err)
		return err
	}

	if !ok {
		slog.Error("Fail to assign role", "error-message", nil)
		return errors.New("fail to assign role")
	}

	if err := u.casbinService.LoadPolicy(); err != nil {
		slog.Error("Fail to refresh policy", "error-message", err)
		return err
	}

	return nil
}
