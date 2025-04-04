package usecase

import (
	"context"
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/question/model/req"
	res "cse-question-bank/internal/module/question/model/res"
	"cse-question-bank/internal/module/question/repository"
)

type QuestionUsecase interface {
	GetQuestion(ctx context.Context, questionId string) (*res.QuestionResponse, error)
	CreateQuestion(ctx context.Context, question *entity.Question) (*res.QuestionResponse, error)
	DeleteQuestion(ctx context.Context, questionId string) error
	EditQuestion(ctx context.Context, question *entity.Question) error
	GetAllQuestions(ctx context.Context) ([]*res.QuestionResponse, error)
	FilterQuestion(ctx context.Context, filterCondition req.FilterQuestionRequest) ([]*res.QuestionResponse, error)
}

func NewQuestionUsecase(casbin *casbin.CasbinService, repo repository.QuestionRepository) QuestionUsecase {
	return &questionBaseUsecaseImpl{
		repo: repo,
		casbin: casbin,
	}
}
