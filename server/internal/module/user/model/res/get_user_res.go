package res

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type GetUserResponse struct {
	Id         uuid.UUID
	Mail       string
	Username   string
	Role       string
	Department entity.Department
}

func EntityToGetUserResponse(userEntity *entity.User) *GetUserResponse {
	return &GetUserResponse{
		Id: userEntity.Id,
		Mail: userEntity.Mail,
		Username: userEntity.Username,
		Role: userEntity.Role,
		Department: userEntity.Department,
	}
}
