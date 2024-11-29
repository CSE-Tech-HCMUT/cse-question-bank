package usecase

import (
	"context"

	"github.com/google/uuid"
)

func (u *subjectUsecaseImpl) DeleteSubject(ctx context.Context, subjectId uuid.UUID) error {
	err := u.subjectRepository.Delete(ctx, nil, map[string]interface{}{
		"id": subjectId,
	})

	if err != nil {
		return err
	}

	return nil
}
