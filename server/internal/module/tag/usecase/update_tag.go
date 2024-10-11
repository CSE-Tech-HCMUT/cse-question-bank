package usecase

import (
	"context"
	"cse-question-bank/internal/module/tag/model/entity"
)

func (t *tagUsecaseImpl) UpdateTag(ctx context.Context, tag entity.Tag) error {
	err := t.tagRepository.Update(ctx, nil, &tag)
	if err != nil {
		return err
	}

	return nil
}
