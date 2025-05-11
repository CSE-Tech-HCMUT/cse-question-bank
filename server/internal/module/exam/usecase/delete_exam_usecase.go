package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) DeleteExam(ctx context.Context, examId uuid.UUID) error {
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if len(exams) == 0 || err != nil {
		return errors.New("exam not found")
	}

	for _, childExam := range exams[0].Children {
		err := u.examRepostiroy.Delete(ctx, nil, map[string]interface{}{
			"id": childExam.Id,
		})
		if err != nil {
			return err
		}
	}
	
	// Delete the parent exam
	err = u.examRepostiroy.Delete(ctx, nil, map[string]interface{}{
		"id": examId,
	})

	if err != nil {
		return err
	}

	return nil

}
