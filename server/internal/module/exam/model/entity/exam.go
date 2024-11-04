package entity

import (
	qe "cse-question-bank/internal/module/question/model/entity"
	te "cse-question-bank/internal/module/tag/model/entity"
	oe "cse-question-bank/internal/module/tag_option/model/entity"
	"cse-question-bank/internal/util"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Exam struct {
	Id               uuid.UUID `gorm:"type:uuid;primaryKey"`
	Semester         string
	Subject          string
	TotalQuestion    int
	FilterConditions []*FilterCondition `gorm:"foreignKey:ExamID;constraint:OnDelete:CASCADE;"`
}

type FilterCondition struct {
	Id             int       `gorm:"primaryKey"`
	ExamID         uuid.UUID `gorm:"type:uuid"`
	ExpectedCount  int
	FilterTagAssignments []*FilterTagAssignment `gorm:"foreignKey:FilterConditionID;constraint:OnDelete:CASCADE;"`
	Questions      []*qe.Question   `gorm:"many2many:filter_condition_questions;constraint:OnDelete:CASCADE;"`
}

type FilterTagAssignment struct {
	Id          int `gorm:"primaryKey"`
	FilterConditionID int
	TagId       int
	Tag         te.Tag `gorm:"foreignKey:TagId;constraint:OnDelete:CASCADE;"`
	OptionId    int
	Option      oe.Option `gorm:"foreignKey:OptionId"`
}

func (e *Exam) BeforeCreate(tx *gorm.DB) (err error) {
	if e.Id == uuid.Nil {
		e.Id, err = util.GenerateUUID()
	}
	return
}
