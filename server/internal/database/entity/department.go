package entity

import "github.com/google/uuid"

type Department struct {
	Id   uuid.UUID
	Name string
	Code string
}
