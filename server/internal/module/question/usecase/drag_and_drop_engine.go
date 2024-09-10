package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model/entity"
)

type dragAndDropEngine struct {
}

func (u *dragAndDropEngine) GetQuestion(ctx context.Context, data interface{}) (*entity.Question, error) {
	return nil, nil
}