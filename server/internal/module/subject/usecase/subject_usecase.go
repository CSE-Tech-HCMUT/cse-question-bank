package usecase

import (
	"context"
	"cse-question-bank/internal/module/subject/model/req"
	"cse-question-bank/internal/module/subject/model/res"
	"cse-question-bank/internal/module/subject/repository"

	"github.com/google/uuid"
)

type SubjectUsecase interface {
	CreateSubject(ctx context.Context, request *req.CreateSubjectRequest) (*res.SubjectResponse, error)
	DeleteSubject(ctx context.Context, subjectId uuid.UUID) error
	GetAllSubjects(ctx context.Context) ([]*res.SubjectResponse, error)
	GetSubjectById(ctx context.Context, subjectId uuid.UUID) (*res.SubjectResponse, error)
	UpdateSubject(ctx context.Context, request *req.UpdateSubjectRequest) (*res.SubjectResponse, error)
}

type subjectUsecaseImpl struct {
	subjectRepository repository.SubjectRepository
}

func NewSubjectRepository(subjectRepository repository.SubjectRepository) SubjectUsecase {
	return &subjectUsecaseImpl{
		subjectRepository: subjectRepository,
	}
}
