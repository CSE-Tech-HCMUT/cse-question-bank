package entity

import "cse-question-bank/internal/module/tag_option/model/entity"

type Tag struct {
	Id          int             `gorm:"primaryKey" json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Options     []entity.Option `gorm:"foreignKey:TagID; constraint:OnDelete:CASCADE;" json:"options"`
}
