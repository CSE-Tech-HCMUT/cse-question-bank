package entity

import (

	"github.com/google/uuid"
)

type TagAssignment struct {
	Id         int `gorm:"primaryKey"`
	QuestionId uuid.UUID `gorm:"type:uuid"`
	TagId      int
	Tag        Tag `gorm:"foreignKey:TagId; constraint:OnDelete:CASCADE;"`
	OptionId   int
	Option     Option `gorm:"foreignKey:OptionId"`
}
