package entity

import "github.com/google/uuid"

type User struct {
	Id uuid.UUID
	Mail string
	Username string
	Password string
	Role string
	Department Department
}