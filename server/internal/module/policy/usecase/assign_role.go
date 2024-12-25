package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

func (u *policyUsecaseImpl) AssignRole(ctx context.Context, userId uuid.UUID, role string) error {
	ok, err := u.casbinService.AddGroupingPolicy(userId, role)
	if err != nil {
		return err
	}

	if !ok {
		return errors.New("fail to assign role")
	}

	return nil
}
