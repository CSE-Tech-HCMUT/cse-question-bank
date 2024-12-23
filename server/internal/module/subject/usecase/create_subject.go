package usecase

import (
	"context"
	"cse-question-bank/internal/module/subject/model/req"
	res "cse-question-bank/internal/module/subject/model/res"
)

func (u *subjectUsecaseImpl) CreateSubject(ctx context.Context, request *req.CreateSubjectRequest) (*res.SubjectResponse, error) {
	subject := request.ToEntity()
	err := u.subjectRepository.Create(ctx, nil, subject)
	if err != nil {
		return nil, err
	}

	return res.EntityToSubjectResponse(subject), err
}