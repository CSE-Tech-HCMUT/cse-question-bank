package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type dragAndDropEngine struct {
}

func (u *dragAndDropEngine) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	return nil, nil
}