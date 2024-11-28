package entity

import (
	"cse-question-bank/internal/util"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuestionType string

var (
	MultipleChoice QuestionType = "multiple_choice"
	DragAndDrop    QuestionType = "drag_and_drop"
	FillInBlank    QuestionType = "fill_in_blank"
)

type Question struct {
	Id      uuid.UUID `gorm:"type:uuid;primaryKey"`
	Content string    `gorm:"type:text"`
	// LatexContent string       `gorm:"type:text"`
	IsParent  bool         `gorm:"type:boolean"`
	ParentId  *uuid.UUID   `gorm:"type:uuid;default:null"` // Nullable foreign key
	RelateId  *uuid.UUID   `gorm:"type:uuid;default:null"` // Nullable foreign key
	Type      QuestionType `gorm:"type:varchar(20)"`
	Difficult int          `gorm:"type:int"`

	SubjectId uuid.UUID `gorm:"type:uuid"` // Foreign key to Subject
	Subject   Subject   `gorm:"foreignKey:SubjectId"`

	Answer *Answer `gorm:"foreignKey:QuestionId;constraint:OnDelete:CASCADE"` // One-to-many relationship

	TagAssignments []TagAssignment `gorm:"foreignKey:QuestionId;constraint:Ondelete:CASCADE"`
}

func (q *Question) BeforeCreate(tx *gorm.DB) (err error) {
	if q.Id == uuid.Nil {
		q.Id, err = util.GenerateUUID()
	}
	return
}
