package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)

type fillInBlankEngine struct {
}

func (u *fillInBlankEngine) GetQuestion(ctx context.Context, data interface{}) (*entity.Question, error) {
	return nil, nil
}
