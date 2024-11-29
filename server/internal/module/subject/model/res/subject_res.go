package res

import (
	"cse-question-bank/internal/database/entity"
	department_res "cse-question-bank/internal/module/department/model/res"

	"github.com/google/uuid"
)

type SubjectResponse struct {
	Id         uuid.UUID
	Name       string
	Code       string
	Department department_res.DepartmentResponse
}

func EntityToSubjectResponse(subject *entity.Subject) *SubjectResponse {
	return &SubjectResponse{
		Id: subject.Id,
		Name: subject.Name,
		Code: subject.Code,
		Department: *department_res.EntityToDepartmentResponse(&subject.Department),
	}
}