package usecase

import (
	"context"
	"cse-question-bank/internal/module/authen/model/req"
	"cse-question-bank/pkg/hash"
)

func (u *authenUsecaseImpl) RegisterAccount(ctx context.Context, request req.RegisterAccountRequest) error {
	userAccount := request.ToEntity()

	hashPassword, err := hash.Generate(request.Password)
	if err != nil {
		return err
	}
	userAccount.Password = hashPassword

	err = u.userRepository.Create(ctx, nil, userAccount)
	if err != nil {
		return err
	}

	return nil
}
