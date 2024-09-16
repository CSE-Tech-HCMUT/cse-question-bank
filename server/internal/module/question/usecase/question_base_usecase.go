package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
	"log/slog"

	"github.com/goccy/go-json"
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

type SingleQuestionResponse struct {
	Id        string
	Content   string
	Type      string
	Tag       string
	Difficult int
	Answer    json.RawMessage
}

type ParentQuestionResponse struct {
	Id      string
	Content string
	// Type      string
	Tag       string
	Difficult int
	Question  []*SingleQuestionResponse
}

func (u *questionBaseUsecaseImpl) GetQuestion(ctx context.Context, questionId string) (interface{}, error) {
	questions, err := u.repo.Find(ctx, map[string]interface{}{
		"id": questionId,
	})

	if err != nil {
		slog.Error("Fail to get question", "error-message", err)
		return nil, constant.ErrGetQuestion(err)
	}

	if len(questions) < 1 {
		slog.Error("Question not found")
		return nil, constant.ErrQuestionNotFound(nil)
	}

	question := questions[0]

	if question.IsParent {
		childQuestions, err := u.repo.Find(ctx, map[string]interface{}{
			"parent_id": questionId,
		})

		if err != nil {
			slog.Error("Fail to get question", "error-message", err)
			return nil, constant.ErrGetQuestion(err)
		}
		// print(childQuestions[0])
		childQuestionsRes := make([]*SingleQuestionResponse, 0)
		for _, childQuestion := range childQuestions {
			childQuestionsRes = append(childQuestionsRes, u.questionModelToSingleQuestion(childQuestion))
		}

		questionRes := u.questionModelToParentQuestion(question, childQuestionsRes)

		return questionRes, nil
	}

	return u.questionModelToSingleQuestion(question), nil

}

func (u *questionBaseUsecaseImpl) questionModelToSingleQuestion(question *model.Question) *SingleQuestionResponse {
	return &SingleQuestionResponse{
		Id:        question.Id.String(),
		Content:   question.Content,
		Type:      string(question.Type),
		Tag:       question.Tag,
		Difficult: question.Difficult,
		Answer:    question.Answer.Content,
	}
}

func (u *questionBaseUsecaseImpl) questionModelToParentQuestion(question *model.Question, childQuestion []*SingleQuestionResponse) *ParentQuestionResponse {
	return &ParentQuestionResponse{
		Id:        question.Id.String(),
		Content:   question.Content,
		Tag:       question.Tag,
		Difficult: question.Difficult,
		Question:  childQuestion,
	}
}
