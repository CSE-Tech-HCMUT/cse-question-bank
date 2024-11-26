package req

import (
	"cse-question-bank/internal/module/user/model/entity"

	"github.com/google/uuid"
)

type UpdateUserProfile struct {
	Id         uuid.UUID
	Department entity.Department
}

func (req *UpdateUserProfile) ToEntity() *entity.User {
	return &entity.User{
		Id: req.Id,
		Department: req.Department,
	}
}