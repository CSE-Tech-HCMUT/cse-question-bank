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

	tagRes, err := t.tagRepository.Find(ctx, nil, map[string]interface{}{
		"id": tag.Id,
	})
	if err != nil {
		return nil, err
	}
	
	return tag_res.EntityToResponse(tagRes[0]), nil
}
