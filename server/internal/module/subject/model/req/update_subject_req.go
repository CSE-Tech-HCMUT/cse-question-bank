package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type UpdateSubjectRequest struct {
	Id             uuid.UUID
	Name           string
	Code           string
	DepartmentCode string
}

func (req *UpdateSubjectRequest) ToEntity() *entity.Subject {
	return &entity.Subject{
		Id:             req.Id,
		Name:           req.Name,
		Code:           req.Code,
		DepartmentCode: req.DepartmentCode,
	}
}
