package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/question/constant"
	"cse-question-bank/internal/module/question/model/req"
	res "cse-question-bank/internal/module/question/model/res"
	"cse-question-bank/internal/module/question/repository"
	"log/slog"

	"github.com/google/uuid"
)

type questionBaseUsecaseImpl struct {
	repo repository.QuestionRepository
}

func (u *questionBaseUsecaseImpl) EditQuestion(ctx context.Context, question *entity.Question) error {
	// TODO check valid option is from tag or not in tagAssignment
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

func (u *questionBaseUsecaseImpl) CreateQuestion(ctx context.Context, question *entity.Question) (*res.QuestionResponse, error) {
	// TODO check valid option is from tag or not in tagAssignment
	err := u.repo.Create(ctx, nil, question)
	if err != nil {
		slog.Error("Fail to create question", "error-message", err)
		return nil, constant.ErrCreateQuestion(err)
	}
	return res.EntityToResponse(question, nil), nil
}

func (u *questionBaseUsecaseImpl) GetQuestion(ctx context.Context, questionId string) (*res.QuestionResponse, error) {
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

	childQuestionsRes := make([]*res.QuestionResponse, 0)
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
			childQuestionsRes = append(childQuestionsRes, res.EntityToResponse(childQuestion, nil))
		}
	}

	return res.EntityToResponse(question, childQuestionsRes), nil
}

func (u *questionBaseUsecaseImpl) GetAllQuestions(ctx context.Context) ([]*res.QuestionResponse, error) {
	questionsEntity, err := u.repo.Find(ctx, nil, map[string]interface{}{
		"parent_id": uuid.Nil,
	})
	if err != nil {
		return nil, nil
	}

	questionsRes := make([]*res.QuestionResponse, 0)
	for _, questionEntity := range questionsEntity {
		questionsRes = append(questionsRes, res.EntityToResponse(questionEntity, nil))
	}

	return questionsRes, nil
}

// Because of this function break the req->entity logic.
// TODO change all parameter in usecase to req, than we will handle convert type to entity in usecase.
func (u *questionBaseUsecaseImpl) GetQuestionByFilter(ctx context.Context, questionFilter req.QuestionFilter) {
	// return list question base on filter

	// TODO:
	// Add pagination.
}
