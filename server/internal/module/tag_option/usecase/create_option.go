package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)

func (u optionUsecaseImpl) CreateOption(ctx context.Context, option *entity.Option) (*entity.Option, error) {
	err := u.optionRepository.Create(ctx, option)
	if err != nil {
		return nil, err
	}

	return option, nil
}
