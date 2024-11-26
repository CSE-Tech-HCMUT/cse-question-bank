package usecase

import (
	"context"
	"cse-question-bank/internal/module/user/model/res"

	"github.com/google/uuid"
)

func (u *userUsecaseImpl) GetUserById(ctx context.Context, userId uuid.UUID) (*res.GetUserResponse, error) {
	user, err := u.userRepository.Find(ctx, nil, map[string]interface{}{
		"id": userId,
	})

	if err != nil {
		return nil, err
	}

	return res.EntityToGetUserResponse(user[0]), nil
} 