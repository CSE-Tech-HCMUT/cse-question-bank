package entity

import (
	"cse-question-bank/internal/util"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Subject struct {
	Id             uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name           string
	Code           string `gorm:"uniqueIndex"`
	DepartmentCode string
	Department     Department `gorm:"foreignKey:DepartmentCode"`
	Users          []User     `gorm:"many2many:subject_users"`
	Questions      []Question `gorm:"foreignKey:SubjectId;constraint:OnDelete:CASCADE"`
	Exams          []Exam     `gorm:"foreignKey:SubjectId;constraint:OnDelete:CASCADE"`
	Tags           []Tag      `gorm:"foreignKey:SubjectId;constraint:OnDelete:CASCADE"`
}

func (s *Subject) BeforeCreate(tx *gorm.DB) (err error) {
	if s.Id == uuid.Nil {
		s.Id, err = util.GenerateUUID()
	}
	return
}
