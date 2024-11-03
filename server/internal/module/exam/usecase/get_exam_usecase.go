package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GetExam(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})

	if err != nil {
		return nil, err
	}

	return exam_res.EntityToResponse(exams[0]), nil
}
