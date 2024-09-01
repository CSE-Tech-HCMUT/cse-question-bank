package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type fillInBlankUsecaseImpl struct {
	questionBaseUsecaseImpl
}

func (u *fillInBlankUsecaseImpl) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	return nil, nil
}
