package usecase

import (
	"context"
	"cse-question-bank/internal/module/authen/model/req"
	"cse-question-bank/internal/module/user/repository"
)

type AuthenUsecase interface {
	Login(ctx context.Context, request *req.LoginRequest) (string, string, error)
	RegisterAccount(ctx context.Context, request req.RegisterAccountRequest) error
}

type authenUsecaseImpl struct {
	userRepository repository.UserRepository
}

func NewAuthenUsecase(userRepository repository.UserRepository) AuthenUsecase {
	return &authenUsecaseImpl{
		userRepository: userRepository,
	}
}
