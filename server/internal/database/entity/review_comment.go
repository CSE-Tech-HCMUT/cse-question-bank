package entity

import (
	"time"

	"github.com/google/uuid"
)

type StatusComment string

var (
	Resolved StatusComment = "resolved"
	Open     StatusComment = "open"
	Outdated StatusComment = "outdated"
)

type ReviewComment struct {
	Id              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Content         string
	Creator         User      `gorm:"foreignKey:CreatorId"`
	CreatorId       uuid.UUID `gorm:"type:uuid"`
	CreatedAt       time.Time
	Status          StatusComment `gorm:"type:varchar(20)"`
	ReplyId         uuid.UUID     `gorm:"type:uuid"`
	ReviewRequestId uuid.UUID     `gorm:"type:uuid"`
}
