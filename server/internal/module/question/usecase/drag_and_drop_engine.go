package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
)
type dragAndDropEngine struct {
}

func (u *dragAndDropEngine) GetQuestion(ctx context.Context, data interface{}) (*entity.Question, error) {
	return nil, nil
}