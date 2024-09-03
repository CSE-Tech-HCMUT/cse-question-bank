package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
	"log/slog"
)

type questionBaseUsecaseImpl struct {
	repo repository.QuestionRepository
}

func NewQuestionUsecase(repo repository.QuestionRepository) QuestionUsecase {
	return &questionBaseUsecaseImpl{
		repo: repo,
	}
}

func (u *questionBaseUsecaseImpl) EditQuestion(ctx context.Context, question *model.Question) error {
	err := u.repo.Update(ctx, question)
	if err != nil {
		slog.Error("Fail to update question", "error-message", err)
		return constant.ErrUpdateQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) DeleteQuestion(ctx context.Context, questionId string) error {
	err := u.repo.Delete(ctx, map[string]interface{}{
		"id": questionId,
	})

	if err != nil {
		slog.Error("Fail to delete question", "error-message", err)
		return constant.ErrDeleteQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) CreateQuestion(ctx context.Context, question *model.Question) error {
	if err := u.repo.Create(ctx, question); err != nil {
		slog.Error("Fail to create question in database", "error-message", err)
		return constant.ErrCreateQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) GetQuestion(ctx context.Context, questionId string) (*model.Question, error) {
	return nil, nil
}
