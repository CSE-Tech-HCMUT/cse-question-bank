package req

import "cse-question-bank/internal/database/entity"

type CreateSubjectRequest struct {
	Name           string	`json:"name"`
	Code           string	`json:"code"`
	DepartmentCode string	`json:"departmentCode"`
}

func (req *CreateSubjectRequest) ToEntity() *entity.Subject {
	return &entity.Subject{
		Name: req.Name,
		Code: req.Code,
		DepartmentCode: req.DepartmentCode,
	}
}