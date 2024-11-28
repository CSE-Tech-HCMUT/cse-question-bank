package usecase

import (
	"context"
	tar "cse-question-bank/internal/module/tag_assignment/repository"
	"cse-question-bank/internal/database/entity"
	tor "cse-question-bank/internal/module/tag_option/repository"
)

type OptionUsecase interface {
	GetUsedOption(ctx context.Context, optionId int) (int, error)
	DeleteOption(ctx context.Context, optionId int) error
	CreateOption(ctx context.Context, option *entity.Option) (*entity.Option, error)
}

type optionUsecaseImpl struct {
	optionRepository        tor.OptionRepository
	tagAssignmentRepository tar.TagAssignmentRepository
}

func NewOptionUsecase(
	optionRepository tor.OptionRepository,
	tagAssignmentRepository tar.TagAssignmentRepository,
) OptionUsecase {
	return &optionUsecaseImpl{
		optionRepository:        optionRepository,
		tagAssignmentRepository: tagAssignmentRepository,
	}
}
