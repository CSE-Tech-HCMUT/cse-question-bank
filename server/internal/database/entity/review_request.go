package entity

import "github.com/google/uuid"

type ReviewRequest struct {
	Id         uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4()"`
	QuestionId uuid.UUID        `gorm:"type:uuid"`
	Questions   []Question       `gorm:"foreignKey:QuestionId"`
	Status     string     `gorm:"type:varchar(20)"`
	Comments    []*ReviewComment `gorm:"foreignKey:ReviewRequestId"`
}
