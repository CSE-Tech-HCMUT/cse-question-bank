package usecase

import (
	"context"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) DeleteExam(ctx context.Context, examId uuid.UUID) error {
	err := u.examRepostiroy.Delete(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	
	if err != nil {
		return err
	}

	return nil

}
