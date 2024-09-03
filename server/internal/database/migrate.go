package database

import (
	"cse-question-bank/internal/module/question/model"

	"gorm.io/gorm"
)

func DataMigrate(db *gorm.DB) error {
	// migrate for question
	err := db.AutoMigrate(model.Question{}, model.Answer{})
	if err != nil {
		return err
	}

	return nil
}
