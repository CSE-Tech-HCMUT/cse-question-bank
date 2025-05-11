package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"errors"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GetExam(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})

	if err != nil {
		return nil, err
	}

	if len(exams) == 0 {
		return nil, errors.New("exam not found")
	}

	return exam_res.EntityToResponse(exams[0]), nil
}
