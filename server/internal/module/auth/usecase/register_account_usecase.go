package usecase

import (
	"context"
	"cse-question-bank/internal/module/auth/model/req"
	"cse-question-bank/internal/module/user/model/entity"
	"cse-question-bank/pkg/hash"
)

func (u *authUsecaseImpl) RegisterAccount(ctx context.Context, request req.RegisterAccountRequest) error {

	hashPassword, err := hash.Generate(request.Password)
	if err != nil {
		return err
	}

	userAccount := &entity.User{
		Mail: request.Mail,
		Password: hashPassword,
		Username: request.Username,
	}

	err = u.userRepository.Create(ctx, nil, userAccount)
	if err != nil {
		return err
	}
	
	return nil
}
