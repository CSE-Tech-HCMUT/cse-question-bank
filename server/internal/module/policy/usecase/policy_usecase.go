package usecase

import (
	"context"
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/module/policy/model/req"

	"github.com/google/uuid"
)

type PolicyUsecase interface {
	AddPolicy(ctx context.Context, request *req.AddPolicyRequest) error
	GetAllRoles(ctx context.Context) ([]string, error)
	AssignRole(ctx context.Context, userId uuid.UUID, role string) error
	GetAllPolicies(ctx context.Context) ([][]string, error)
}

type policyUsecaseImpl struct {
	casbinService casbin.CasbinService
}

func NewPolicyUsecase(casbinService casbin.CasbinService) PolicyUsecase {
	return &policyUsecaseImpl{
		casbinService: casbinService,
	}
}
