package req

import (
	"cse-question-bank/internal/database/entity"
)

type RegisterAccountRequest struct {
	Mail     string
	Username string
	Password string
}

func (req *RegisterAccountRequest) ToEntity() *entity.User {

	return &entity.User{
		Mail:     req.Mail,
		Username: req.Username,
	}
}
