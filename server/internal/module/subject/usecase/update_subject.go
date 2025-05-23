package usecase

import (
	"context"
	"cse-question-bank/internal/module/subject/model/req"
	res "cse-question-bank/internal/module/subject/model/res"
)

func (u *subjectUsecaseImpl) UpdateSubject(ctx context.Context, request *req.UpdateSubjectRequest) (*res.SubjectResponse, error) {
	subject := request.ToEntity()
	
	err := u.subjectRepository.Update(ctx, nil, subject)	
	if err != nil {
		return nil, err
	}

	return res.EntityToSubjectResponse(subject), nil
}