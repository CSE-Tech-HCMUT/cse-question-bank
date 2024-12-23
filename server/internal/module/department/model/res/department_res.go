package department_res

import "cse-question-bank/internal/database/entity"

type DepartmentResponse struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

func EntityToDepartmentResponse(department *entity.Department) *DepartmentResponse {
	return &DepartmentResponse{
		Code: department.Code,
		Name: department.Name,
	}
}
