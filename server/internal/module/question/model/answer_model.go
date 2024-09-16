package model

import (
	"cse-question-bank/internal/util"
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Answer struct {
	Id         uuid.UUID       `gorm:"type:uuid;primaryKey"`
	Content    json.RawMessage `gorm:"type:jsonb"` // Store as JSONB in Postgres
	QuestionId uuid.UUID       `gorm:"type:uuid"`
	// Question   Question  `gorm:"foreignKey:QuestionId;constraint:OnDelete:CASCADE"` // Add foreign key constraint
}

func (a *Answer) BeforeCreate(tx *gorm.DB) (err error) {
	if a.Id == uuid.Nil {
		a.Id, err = util.GenerateUUID()
	}
	return
}
