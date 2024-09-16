package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type fillInBlankEngine struct {
}

func (u *fillInBlankEngine) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	return nil, nil
}
