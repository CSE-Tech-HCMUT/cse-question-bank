package res

import (
	"cse-question-bank/internal/module/user/model/entity"

	"github.com/google/uuid"
)

type CreateUserResponse struct {
	Id         uuid.UUID
	Mail       string
	Username   string
	Password   string
	Role       string
	Department entity.Department
}

func EntityToCreateUserResponse(userEntity *entity.User) *CreateUserResponse {
	return &CreateUserResponse{
		Id:         userEntity.Id,
		Mail:       userEntity.Mail,
		Username:   userEntity.Username,
		Password:   userEntity.Password,
		Role:       userEntity.Role,
		Department: userEntity.Department,
	}
}