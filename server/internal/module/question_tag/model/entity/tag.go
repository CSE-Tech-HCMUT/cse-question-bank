package entity

import "cse-question-bank/internal/module/question_tag_option/model/entity"

type Tag struct {
	Id          int `gorm:"primaryKey"`
	Name        string
	Description string
	Options     []entity.Option `gorm:"foreignKey:TagID"`
}
