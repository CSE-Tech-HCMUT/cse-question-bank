package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)

func (t *tagUsecaseImpl) CreateTag(ctx context.Context, tag *entity.Tag) (*entity.Tag, error) {
	err := t.tagRepository.Create(ctx, nil, tag)
	if err != nil {
		return nil, err
	}

	return tag, nil
}
