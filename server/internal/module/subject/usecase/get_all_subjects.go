package usecase

import (
	"context"
	res "cse-question-bank/internal/module/subject/model/res"
)

func (u *subjectUsecaseImpl) GetAllSubjects(ctx context.Context) ([]*res.SubjectResponse, error) {
	subjects, err := u.subjectRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	subjectResList := make([]*res.SubjectResponse, 0)
	for _, subject := range subjects {
		subjectRes := res.EntityToSubjectResponse(subject)

		subjectResList = append(subjectResList, subjectRes)
	}

	return subjectResList, nil
}