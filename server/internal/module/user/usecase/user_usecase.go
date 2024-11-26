package usecase

import (
	"context"
	"cse-question-bank/internal/module/user/model/req"
	"cse-question-bank/internal/module/user/model/res"
	"cse-question-bank/internal/module/user/repository"

	"github.com/google/uuid"
)

type UserUsecase interface {
	CreateUser(ctx context.Context, request *req.CreateUserRequest) (*res.CreateUserResponse, error)
	DeleteUser(ctx context.Context, userId uuid.UUID) error
	GetUserById(ctx context.Context, userId uuid.UUID) (*res.GetUserResponse, error)
	GetAllUsers(ctx context.Context) ([]*res.GetUserResponse, error)
	UpdateUserProfile(ctx context.Context, request req.UpdateUserProfile) (*res.UpdateUserProfileResponse, error)
}

type userUsecaseImpl struct {
	userRepository repository.UserRepository
}

func NewUserUsecase(userRepository repository.UserRepository) UserUsecase {
	return &userUsecaseImpl{
		userRepository: userRepository,
	}
}
