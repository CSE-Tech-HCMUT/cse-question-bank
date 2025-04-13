package entity

import (
	"cse-question-bank/internal/util"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Exam struct {
	Id               uuid.UUID `gorm:"type:uuid;primaryKey"`
	Semester         string
	SubjectId        *uuid.UUID `gorm:"type:uuid;default:null"` // Foreign key to Subject
	Subject          Subject    `gorm:"foreignKey:SubjectId"`
	TotalQuestion    int
	FilterConditions []*FilterCondition `gorm:"foreignKey:ExamID;constraint:OnDelete:CASCADE;"`
	Questions        []*Question        `gorm:"many2many:exam_questions;constraint:OnDelete:CASCADE;"`
	Code             int

	// Reference to the parent exam (if cloned from another exam)
	ParentExamId *uuid.UUID `gorm:"type:uuid;default:null"` // Foreign key to parent exam
	ParentExam   *Exam      `gorm:"foreignKey:ParentExamId"`

	// Reference to child exams (if this exam is cloned to others)
	Children []*Exam `gorm:"foreignKey:ParentExamId;constraint:OnDelete:SET NULL;"`

	// TODO: add filtercondition for exam to monitor
}

type FilterCondition struct {
	Id                   int       `gorm:"primaryKey"`
	ExamID               uuid.UUID `gorm:"type:uuid"`
	ExpectedCount        int
	FilterTagAssignments []*FilterTagAssignment `gorm:"foreignKey:FilterConditionID;constraint:OnDelete:CASCADE;"`
	// Questions            []*Question            `gorm:"many2many:filter_condition_questions;constraint:OnDelete:CASCADE;"`
	Note string
}

type FilterTagAssignment struct {
	Id                int `gorm:"primaryKey"`
	FilterConditionID int
	TagId             int
	Tag               Tag `gorm:"foreignKey:TagId;constraint:OnDelete:CASCADE;"`
	OptionId          int
	Option            Option `gorm:"foreignKey:OptionId"`
}

func (e *Exam) BeforeCreate(tx *gorm.DB) (err error) {
	if e.Id == uuid.Nil {
		e.Id, err = util.GenerateUUID()
	}
	return
}
