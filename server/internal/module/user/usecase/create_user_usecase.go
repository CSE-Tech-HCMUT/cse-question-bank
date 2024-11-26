package usecase

import (
	"context"
	"cse-question-bank/internal/module/user/model/req"
	"cse-question-bank/internal/module/user/model/res"
)

// this is usecase for creating user by admin
// create user for user using = register
func (u *userUsecaseImpl) CreateUser(ctx context.Context, request *req.CreateUserRequest) (*res.CreateUserResponse, error) {
	// generate random password
	// create user
	// return for client
	userEntity := request.ToEntity()
	err := u.userRepository.Create(ctx, nil, userEntity)
	if err != nil {
		return nil, err
	}

	// FUTURE: set password to 1-time-use. need to change password after first time login.
	return res.EntityToCreateUserResponse(userEntity), nil
}
