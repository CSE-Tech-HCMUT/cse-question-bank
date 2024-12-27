package entity

import "github.com/google/uuid"

type Tag struct {
	Id          int `gorm:"primaryKey"`
	Name        string
	Description string
	// TODO: Add table subject -> model subject
	SubjectId *uuid.UUID `gorm:"type:uuid;default:null"`
	Subject   Subject    `gorm:"foreignKey:SubjectId; constraints:OnDelete:CASCADE;"`
	Options   []Option   `gorm:"foreignKey:TagID; constraint:OnDelete:CASCADE;"`
}
