package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model/entity"
)

type multipleChoiceEngine struct {
}

func (u *multipleChoiceEngine) GetQuestion(ctx context.Context, data interface{}) (*entity.Question, error) {
	return nil, nil
}