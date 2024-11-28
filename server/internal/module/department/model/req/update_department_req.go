package req

import "cse-question-bank/internal/database/entity"

type UpdateDepartmentRequest struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

func (req *UpdateDepartmentRequest) ToEntity() *entity.Department {
	return &entity.Department{
		Code: req.Code,
		Name: req.Name,
	}
}
