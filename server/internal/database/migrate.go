package database

import (
	"cse-question-bank/internal/module/question/model/entity"

	"gorm.io/gorm"
)

func DataMigrate(db *gorm.DB) error {
	// migrate for question
	err := db.AutoMigrate(entity.Question{}, entity.Answer{})
	if err != nil {
		return err
	}

	return nil
}
