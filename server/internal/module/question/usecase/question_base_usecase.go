package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
	"cse-question-bank/internal/util"
	"log/slog"
)

type questionBaseUsecaseImpl struct {
	repo repository.QuestionRepository
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
	questionId, err := util.GenerateUUID()
	if err != nil {
		slog.Error("Fail to generate UUID", "error-message", err)
		return constant.ErrCreateQuestion(err)
	}

	question.Id = questionId
	if err = u.repo.Create(ctx, question); err != nil {
		slog.Error("Fail to create question in database", "error-message", err)
		return constant.ErrCreateQuestion(err)
	}
	
	return nil
}