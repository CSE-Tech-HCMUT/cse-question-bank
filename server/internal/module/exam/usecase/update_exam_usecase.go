package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"errors"
)

func (u *examUsecaseImpl) UpdateExam(ctx context.Context, request *req.UpdateExamRequest) (*exam_res.ExamResponse, error) {
	exam := request.ToEntity()

	examEntity, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": exam.Id,
	})
	if len(examEntity) == 0 {
		return nil, errors.New("exam not found")
	}

	if err != nil {
		return nil, err
	}
	

	questionList := make([]*entity.Question, 0)
	for _, q := range exam.Questions {
		questions, err := u.questionRepository.Find(ctx, nil, map[string]interface{}{
			"id": q.Id,
		})

		if err != nil {
			return nil, err
		}

		questionList = append(questionList, questions[0])
	}

	exam.Questions = questionList

	err = u.examRepostiroy.Update(ctx, nil, exam)
	if err != nil {
		return nil, err
	}

	examEntity, _ = u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": exam.Id,
	})

	return exam_res.EntityToResponse(examEntity[0]), nil
}
