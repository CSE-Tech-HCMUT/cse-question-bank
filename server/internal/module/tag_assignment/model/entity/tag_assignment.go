package entity

import (
	te "cse-question-bank/internal/module/tag/model/entity"
	toe "cse-question-bank/internal/module/tag_option/model/entity"

	"github.com/google/uuid"
)

type TagAssignment struct {
	Id         int `gorm:"primaryKey"`
	QuestionId uuid.UUID `gorm:"type:uuid"`
	TagId      int
	Tag        te.Tag `gorm:"foreignKey:TagId; constraint:OnDelete:CASCADE;"`
	OptionId   int
	Option     toe.Option `gorm:"foreignKey:OptionId"`
}
