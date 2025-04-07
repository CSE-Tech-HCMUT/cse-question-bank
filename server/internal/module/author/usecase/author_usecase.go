package usecase

import (
	"context"
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/module/author/model/req"
)

type AuthorUsecase interface {
	AddPolicy(ctx context.Context, request *req.AddPolicyRequest) error
	GetAllRoles(ctx context.Context) ([]string, error)
	AssignRole(ctx context.Context, request *req.AssignRoleRequest) error
	GetAllPolicies(ctx context.Context) ([][]string, error)
	GetGroupingPolicy(ctx context.Context) ([][]string, error)
}

type authorUsecaseImpl struct {
	casbinService *casbin.CasbinService
}

func NewAuthorUsecase(casbinService *casbin.CasbinService) AuthorUsecase {
	return &authorUsecaseImpl{
		casbinService: casbinService,
	}
}
