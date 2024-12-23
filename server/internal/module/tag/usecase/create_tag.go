package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	tag_res "cse-question-bank/internal/module/tag/model/res"
)

func (t *tagUsecaseImpl) CreateTag(ctx context.Context, tag *entity.Tag) (*tag_res.TagResponse, error) {
	err := t.tagRepository.Create(ctx, nil, tag)
	if err != nil {
		return nil, err
	}

	tagRes := tag_res.EntityToResponse(tag)

	return tagRes, nil
}
