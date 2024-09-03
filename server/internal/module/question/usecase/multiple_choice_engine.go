package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type multipleChoiceEngine struct {
}

func (u *multipleChoiceEngine) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	return nil, nil
}