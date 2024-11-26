package usecase

import (
	"context"
	"cse-question-bank/internal/module/user/model/res"
)

// for admin
func (u *userUsecaseImpl) GetAllUsers(ctx context.Context) ([]*res.GetUserResponse, error) {
	userList, err := u.userRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	userListRes := make([]*res.GetUserResponse, 0)
	for _, user := range userList {
		userListRes = append(userListRes, res.EntityToGetUserResponse(user))
	}

	return userListRes, nil
}
