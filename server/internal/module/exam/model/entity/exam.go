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
	Id             uuid.UUID      `gorm:"type:uuid;primaryKey"`
	Questions      []*qe.Question `gorm:"many2many:exam_questions;constraint:OnDelete:CASCADE;"`
	NumberQuestion int
	Semester       string
	Subject        string
	FilterTags     []*FilterTag `gorm:"foreignKey:ExamID;constraint:OnDelete:CASCADE;"`
}

type FilterTag struct {
	Id              int       `gorm:"primaryKey"`
	ExamID          uuid.UUID `gorm:"type:uuid"` // Khóa ngoại liên kết với Exam
	NumberQuestions int
	TagAssignments  []*TagAssignment `gorm:"foreignKey:FilterTagID;constraint:OnDelete:CASCADE;"`
}

type TagAssignment struct {
	Id          int `gorm:"primaryKey"`
	FilterTagID int // Khóa ngoại liên kết với FilterTag
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
