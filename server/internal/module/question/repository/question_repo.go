package model

import "gorm.io/gorm"

type QuestionRepository interface{}

type questionRepositoryImpl struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepositoryImpl{
		db: db,
	}
}