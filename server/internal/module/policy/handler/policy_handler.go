package handler

import (
	"cse-question-bank/internal/module/policy/usecase"
)

type PolicyHandler interface {
}

type policyHandlerImpl struct {
	policyUsecase usecase.PolicyUsecase
}

func NewAuthHandler(policyUsecase usecase.PolicyUsecase) PolicyHandler {
	return &policyHandlerImpl{
		policyUsecase: policyUsecase,
	}
}
