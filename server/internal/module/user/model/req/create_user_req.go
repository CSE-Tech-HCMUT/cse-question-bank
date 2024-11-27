package req

import "cse-question-bank/internal/database/entity"

type CreateUserRequest struct {
	Mail       string
	Username   string
	Role       string
	Department entity.Department
}

func (req *CreateUserRequest) ToEntity() *entity.User {
	return &entity.User{
		Mail:       req.Mail,
		Username:   req.Username,
		Role:       req.Role,
		Department: req.Department,
	}
}
