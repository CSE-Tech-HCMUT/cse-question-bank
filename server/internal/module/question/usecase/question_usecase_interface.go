package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/question/model/res"
	"cse-question-bank/internal/module/question/repository"
)

type QuestionUsecase interface {
	GetQuestion(ctx context.Context, questionId string) (*res.QuestionResponse, error)
	CreateQuestion(ctx context.Context, question *entity.Question) (*res.QuestionResponse, error)
	DeleteQuestion(ctx context.Context, questionId string) error
	EditQuestion(ctx context.Context, question *entity.Question) error
	GetAllQuestions(ctx context.Context) ([]*res.QuestionResponse, error)
}

func NewQuestionUsecase(repo repository.QuestionRepository) QuestionUsecase {
	return &questionBaseUsecaseImpl{
		repo: repo,
	}
}
