package usecase

import (
	"context"
	"cse-question-bank/internal/module/auth/model/req"
	"cse-question-bank/internal/module/user/repository"
)

type AuthUsecase interface {
	Login(ctx context.Context, request *req.LoginRequest) (string, string, error)
	RegisterAccount(ctx context.Context, request req.RegisterAccountRequest) error
}

type authUsecaseImpl struct {
	userRepository repository.UserRepository
}

func NewAuthUsecase(userRepository repository.UserRepository) AuthUsecase {
	return &authUsecaseImpl{
		userRepository: userRepository,
	}
}
