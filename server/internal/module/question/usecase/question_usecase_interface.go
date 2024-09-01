package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model"
)

type QuestionUsecase interface {
	GetQuestion(ctx context.Context, data interface{}) (*model.Question, error)
	CreateQuestion(ctx context.Context, question *model.Question) error
	DeleteQuestion(ctx context.Context, questionId string) error
	EditQuestion(ctx context.Context, question *model.Question) error
}
