package usecase

import (
	"context"
	"cse-question-bank/internal/module/subject/model/res"

	"github.com/google/uuid"
)

func (u *subjectUsecaseImpl) GetSubjectById(ctx context.Context, subjectId uuid.UUID) (*res.SubjectResponse, error) {
	subjects, err := u.subjectRepository.Find(ctx, nil, map[string]interface{}{
		"id": subjectId,
	})

	if err != nil {
		return nil, err
	}

	return res.EntityToSubjectResponse(subjects[0]), nil
}