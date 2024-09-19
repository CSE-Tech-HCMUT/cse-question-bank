package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model/entity"
	"cse-question-bank/internal/module/question/repository"
	"encoding/json"
	"log/slog"
)

type questionBaseUsecaseImpl struct {
	repo repository.QuestionRepository
}

type QuestionResponse struct {
	Id        string `json:"id"`
	Content   string	`json:"content"`
	Type      string	`json:"type"`
	Tag       string	`json:"tag"`
	Difficult int	`json:"difficult"`
	Question  []*QuestionResponse `json:"subQuestions"`
	Answer    *AnswerResponse	`json:"answer"`
}

type AnswerResponse struct {
	Id      string	`json:"id"`
	Content json.RawMessage	`json:"content"`
}

func (u *questionBaseUsecaseImpl) EditQuestion(ctx context.Context, question *entity.Question) error {
	err := u.repo.Update(ctx, nil, question)
	if err != nil {
		slog.Error("Fail to update question", "error-message", err)
		return constant.ErrUpdateQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) DeleteQuestion(ctx context.Context, questionId string) error {
	questions, err := u.repo.Find(ctx, nil, map[string]interface{}{
		"id": questionId,
	})
	if err != nil {
		slog.Error("Fail to get question", "error-message", err)
		return constant.ErrDeleteQuestion(err)
	}
	if len(questions) == 0 {
		slog.Error("Question is not exist in datbase", "error-message", err)
		return constant.ErrQuestionNotFound(err)
	}

	tx, err := u.repo.BeginTx(ctx)
	if err != nil {
		slog.Error("Fail to begin transaction in delete", "error-message", err)
		return constant.ErrDatabaseQuestion(err)
	}
	defer u.repo.RollBackTx(tx)

	question := questions[0]
	if question.IsParent {
		err := u.repo.Delete(ctx, tx, map[string]interface{}{
			"parent_id": question.Id,
		})
		if err != nil {
			slog.Error("Error when delete sub questions", "error-message", err)
			return constant.ErrDeleteQuestion(err)
		}
	}
	
	err = u.repo.Delete(ctx, tx, map[string]interface{}{
		"id": questionId,
	})
	if err != nil {
		slog.Error("Fail to delete question", "error-message", err)
		return constant.ErrDeleteQuestion(err)
	}

	err = u.repo.CommitTx(tx) 
	if err != nil {
		slog.Error("Fail when commit transaction", "error-message", err)
		return constant.ErrDatabaseQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) CreateQuestion(ctx context.Context, question *entity.Question) error {
	err := u.repo.Create(ctx, nil, question)
	if err != nil {
		slog.Error("Fail to create question", "error-message", err)
		return constant.ErrCreateQuestion(err)
	}

	return nil
}

func (u *questionBaseUsecaseImpl) GetQuestion(ctx context.Context, questionId string) (interface{}, error) {
	questions, err := u.repo.Find(ctx, nil, map[string]interface{}{
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

	childQuestionsRes := make([]*QuestionResponse, 0)
	if question.IsParent {
		childQuestions, err := u.repo.Find(ctx, nil, map[string]interface{}{
			"parent_id": questionId,
		})

		if err != nil {
			slog.Error("Fail to get question", "error-message", err)
			return nil, constant.ErrGetQuestion(err)
		}
		// need to recursive this for block in block case
		for _, childQuestion := range childQuestions {
			childQuestionsRes = append(childQuestionsRes, u.convertToQuestionResponse(childQuestion, nil))
		}
	}

	return u.convertToQuestionResponse(question, childQuestionsRes), nil
}

func (u *questionBaseUsecaseImpl) convertToQuestionResponse(question *entity.Question, childQuestion []*QuestionResponse) *QuestionResponse {
	var answer *AnswerResponse
	if question.Answer != nil {
		answer = &AnswerResponse{
			Id: question.Answer.Id.String(),
			Content: question.Answer.Content,
		}
	}

	return &QuestionResponse{
		Id:        question.Id.String(),
		Content:   question.Content,
		Type:      string(question.Type),
		Tag:       question.Tag,
		Difficult: question.Difficult,
		Answer:    answer,
		Question:  childQuestion,
	}
}

// func (u *questionBaseUsecaseImpl)
