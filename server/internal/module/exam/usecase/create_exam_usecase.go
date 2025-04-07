package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
)

func (u *examUsecaseImpl) CreateExam(ctx context.Context, request req.CreateExamRequest) (*exam_res.ExamResponse, error) {
	// TODO check valid numberquestion 
	// Create util to valid it
	// tag also
	exam := request.ToEntity()

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
	err := u.examRepostiroy.Create(ctx, nil, &exam)

	if err != nil {
		return nil, err
	}

	// TODO: find solution to remove it for getting full data of exam
	response, _ := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": exam.Id,
	})

	return exam_res.EntityToResponse(response[0]), nil
}