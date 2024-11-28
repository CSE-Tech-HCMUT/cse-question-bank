package req

import "cse-question-bank/internal/database/entity"

type CreateDepartmentRequest struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

func (req *CreateDepartmentRequest) ToEntity() *entity.Department {
	return &entity.Department{
		Code: req.Code,
		Name: req.Name,
	}
}
