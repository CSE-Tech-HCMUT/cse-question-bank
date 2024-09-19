package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model/entity"
	"cse-question-bank/internal/module/question/repository"
)

type QuestionUsecase interface {
	GetQuestion(ctx context.Context, questionId string) (interface{}, error)
	CreateQuestion(ctx context.Context, question *entity.Question) error
	DeleteQuestion(ctx context.Context, questionId string) error
	EditQuestion(ctx context.Context, question *entity.Question) error
}

func NewQuestionUsecase(repo repository.QuestionRepository) QuestionUsecase {
	return &questionBaseUsecaseImpl{
		repo: repo,
	}
}
