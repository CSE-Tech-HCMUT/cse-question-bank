package subject_res

import (
	"cse-question-bank/internal/database/entity"
	department_res "cse-question-bank/internal/module/department/model/res"
	tag_res "cse-question-bank/internal/module/tag/model/res"

	"github.com/google/uuid"
)

type SubjectResponse struct {
	Id         uuid.UUID                         `json:"id"`
	Name       string                            `json:"name"`
	Code       string                            `json:"code"`
	Department department_res.DepartmentResponse `json:"department"`
	Tags       []*tag_res.TagResponse            `json:"tags"`
}

func EntityToSubjectResponse(subject *entity.Subject) *SubjectResponse {
	tagListRes := make([]*tag_res.TagResponse, 0)
	for _, tag := range subject.Tags {
		tagListRes = append(tagListRes, tag_res.EntityToResponse(&tag))
	}

	return &SubjectResponse{
		Id:         subject.Id,
		Name:       subject.Name,
		Code:       subject.Code,
		Department: *department_res.EntityToDepartmentResponse(&subject.Department),
		Tags:       tagListRes,
	}
}
