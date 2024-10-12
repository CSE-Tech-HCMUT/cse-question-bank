package usecase

import (
	"context"
	"cse-question-bank/internal/module/tag/model/entity"
	"cse-question-bank/internal/module/tag/repository"
)

type TagUsecase interface {
	GetTag(ctx context.Context, tagId int) (*entity.Tag, error)
	GetAllTag(ctx context.Context) ([]*entity.Tag, error)
	UpdateTag(ctx context.Context, tag entity.Tag) error
	DeleteTag(ctx context.Context, tagId int) error
	CreateTag(ctx context.Context, tag entity.Tag) (int, error)
}

type tagUsecaseImpl struct {
	tagRepository repository.TagRepository
}

func NewTagUsecase(tagRepository repository.TagRepository) TagUsecase {
	return &tagUsecaseImpl{
		tagRepository: tagRepository,
	}
}
