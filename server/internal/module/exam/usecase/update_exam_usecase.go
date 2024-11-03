package usecase

import (
	"context"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
)

func (u *examUsecaseImpl) UpdateExam(ctx context.Context, request *req.UpdateExamRequest) (*exam_res.ExamResponse, error) {
	exam := request.ToEntity()
	
	err := u.examRepostiroy.Update(ctx, nil, exam) 
	if err != nil {
		return nil, err
	}

	return exam_res.EntityToResponse(exam), nil
}