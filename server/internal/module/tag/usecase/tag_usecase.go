package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	tag_res "cse-question-bank/internal/module/tag/model/res"
	"cse-question-bank/internal/module/tag/repository"
)

type TagUsecase interface {
	GetTag(ctx context.Context, tagId int) (*tag_res.TagResponse, error)
	GetAllTag(ctx context.Context) ([]*tag_res.TagResponse, error)
	UpdateTag(ctx context.Context, tag *entity.Tag) error
	DeleteTag(ctx context.Context, tagId int) error
	CreateTag(ctx context.Context, tag *entity.Tag) (*tag_res.TagResponse, error)
}

type tagUsecaseImpl struct {
	tagRepository repository.TagRepository
}

func NewTagUsecase(tagRepository repository.TagRepository) TagUsecase {
	return &tagUsecaseImpl{
		tagRepository: tagRepository,
	}
}
