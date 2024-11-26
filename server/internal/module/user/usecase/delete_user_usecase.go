package usecase

import (
	"context"

	"github.com/google/uuid"
)

// for admin
func (u *userUsecaseImpl) DeleteUser(ctx context.Context, userId uuid.UUID) error {
	err := u.userRepository.Delete(ctx, nil, map[string]interface{}{
		"id": userId,
	})

	if err != nil {
		return err
	}
	
	return nil
}