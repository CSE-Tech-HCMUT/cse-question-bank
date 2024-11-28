package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)

func (t *tagUsecaseImpl) GetTag(ctx context.Context, tagId int) (*entity.Tag, error) {
	tags, err := t.tagRepository.Find(ctx, nil, map[string]interface{}{
		"id": tagId,
	})
	if err != nil {
		return nil, nil
	}

	return tags[0], nil 
}