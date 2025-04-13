package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"
)

func (u *examUsecaseImpl) GetAllExams(ctx context.Context) ([]*exam_res.ExamResponse, error) {
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"parent_exam_id": nil,
	})
	if err != nil {
		return nil, err
	}
	examListRes := make([]*exam_res.ExamResponse, 0)
	for _, exam := range exams {
		examListRes = append(examListRes, exam_res.EntityToResponse(exam))
	}

	return examListRes, nil
}