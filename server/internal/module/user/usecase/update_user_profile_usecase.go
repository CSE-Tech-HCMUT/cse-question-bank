package usecase

import (
	"context"
	"cse-question-bank/internal/module/user/model/req"
	"cse-question-bank/internal/module/user/model/res"
)

func (u *userUsecaseImpl) UpdateUserProfile(ctx context.Context, request req.UpdateUserProfile) (*res.UpdateUserProfileResponse, error) {
	userEntity := request.ToEntity()
	err := u.userRepository.Update(ctx, nil, userEntity)
	if err != nil {
		return nil, err
	}

	return res.EntityToUpdateUserProfileResponse(userEntity), nil
}
