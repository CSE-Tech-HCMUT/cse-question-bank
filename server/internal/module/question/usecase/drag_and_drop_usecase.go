package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type dragAndDropUsecaseImpl struct {
	questionBaseUsecaseImpl
}

func (u *dragAndDropUsecaseImpl) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	return nil, nil
}