package usecase

import (
	"context"
	"cse-question-bank/internal/module/question_tag/model/entity"
)

func (t *tagUsecaseImpl) CreateTag(ctx context.Context, tag entity.Tag) (int, error) {
	err := t.tagRepository.Create(ctx, nil, &tag)
	if err != nil {
		return -1, err
	}

	return tag.Id, nil
}
