package res

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type UpdateUserProfileResponse struct {
	Id         uuid.UUID
	Department entity.Department
}

func EntityToUpdateUserProfileResponse(user *entity.User) *UpdateUserProfileResponse {
	return &UpdateUserProfileResponse{
		Id: user.Id,
		Department: user.Department,
	}
}