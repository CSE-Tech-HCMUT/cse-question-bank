package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)

func (t *tagUsecaseImpl) GetAllTag(ctx context.Context) ([]*entity.Tag, error) {
	tags, err := t.tagRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	return tags, nil
}