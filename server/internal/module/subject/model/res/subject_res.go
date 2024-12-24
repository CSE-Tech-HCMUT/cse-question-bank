package subject_res

import (
	"cse-question-bank/internal/database/entity"
	department_res "cse-question-bank/internal/module/department/model/res"

	"github.com/google/uuid"
)

type SubjectResponse struct {
	Id         uuid.UUID	`json:"id"`
	Name       string	`json:"name"`
	Code       string	`json:"code"`
	Department department_res.DepartmentResponse	`json:"department"`
}

func EntityToSubjectResponse(subject *entity.Subject) *SubjectResponse {
	return &SubjectResponse{
		Id: subject.Id,
		Name: subject.Name,
		Code: subject.Code,
		Department: *department_res.EntityToDepartmentResponse(&subject.Department),
	}
}