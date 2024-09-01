package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
	"fmt"
	"log/slog"
)

type questionFactoryUsecase struct {
	repo repository.QuestionRepository
	usecaseMap map[model.QuestionType]func() QuestionUsecase
}

func NewQuestionUsecaseFactory(repo repository.QuestionRepository) QuestionUsecase {
	base := questionBaseUsecaseImpl{
		repo: repo,
	}

	return &questionFactoryUsecase{
		usecaseMap: map[model.QuestionType]func() QuestionUsecase{
			model.MultipleChoice: func() QuestionUsecase { return &multipleChoiceUsecaseImpl{questionBaseUsecaseImpl: base} },
			model.DragAndDrop:    func() QuestionUsecase { return &dragAndDropUsecaseImpl{questionBaseUsecaseImpl: base} },
			model.FillInBlank:    func() QuestionUsecase { return &fillInBlankUsecaseImpl{questionBaseUsecaseImpl: base} },
		},
	}
}

func (f *questionFactoryUsecase) getUsecase(questionType model.QuestionType) (QuestionUsecase, error) {
	if constructor, exists := f.usecaseMap[questionType]; exists {
		return constructor(), nil
	}

	return nil, fmt.Errorf("question type '%s' not recognized", questionType)
}

func (f *questionFactoryUsecase) GetQuestion(ctx context.Context, data interface{}) (*model.Question, error) {
	questions, err := f.repo.Find(ctx, map[string]interface{}{
		"id": data,
	})
	if err != nil {
		slog.Error("Question not found in database", "error-message", err)
		return nil, constant.ErrQuestionNotFound(err)
	}

	question := questions[0]

	questionUsecase, err := f.getUsecase(question.Type)
	if err != nil {
		slog.Error("Question type not supported", "error-message", err)
		return nil, constant.ErrQuestionTypeNotSupport(err)
	}

	question, err = questionUsecase.GetQuestion(ctx, data)
	if err != nil {
		return nil, err
	}

	return question, nil
}

func (f *questionFactoryUsecase) CreateQuestion(ctx context.Context, question *model.Question) error {
	questionUsecase, err := f.getUsecase(question.Type)
	if err != nil {
		slog.Error("Question type not supported", "error-message", err)
		return constant.ErrQuestionTypeNotSupport(err)
	}

	err = questionUsecase.CreateQuestion(ctx, question)
	if err != nil {
		slog.Error("Can not create question", "error-message", err)
		return constant.ErrCreateQuestion(err)
	}

	return nil
}

func (f *questionFactoryUsecase) DeleteQuestion(ctx context.Context, questionId string) error {
	questions, err := f.repo.Find(ctx, map[string]interface{}{
		"id": questionId,
	})
	if err != nil {
		slog.Error("Question not found in database", "error-message", err)
		return constant.ErrQuestionNotFound(err)
	}

	question := questions[0]

	questionUsecase, err := f.getUsecase(question.Type)
	if err != nil {
		slog.Error("Question type not supported", "error-message", err)
		return constant.ErrQuestionTypeNotSupport(err)
	}

	err = questionUsecase.DeleteQuestion(ctx, questionId)
	if err != nil {
		slog.Error("Can not delete question", "error-message", err)
		return constant.ErrDeleteQuestion(err)
	}

	return nil
}

func (u *questionFactoryUsecase) EditQuestion(ctx context.Context, question *model.Question) error {
	return nil
}