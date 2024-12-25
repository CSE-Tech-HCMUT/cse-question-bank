package usecase

import (
	"context"
	"cse-question-bank/internal/module/policy/model/req"
	"errors"
)

func (u *policyUsecaseImpl) AddPolicy(ctx context.Context, request *req.AddPolicyRequest) error {
	ok, err := u.casbinService.AddPolicy(request.Role, request.Object, request.Method)
	if err != nil {
		return err
	}

	if !ok {
		return errors.New("fail to add policy")
	}

	return nil
}
