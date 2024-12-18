package database

import (
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

func DataMigrate(db *gorm.DB) error {
	// migrate for question
	err := db.AutoMigrate(entity.Question{}, entity.Answer{})
	if err != nil {
		return err
	}
	
	err = db.AutoMigrate(entity.Tag{}, entity.Option{}, entity.TagAssignment{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(entity.Exam{}, entity.FilterCondition{}, entity.FilterTagAssignment{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(entity.User{}, entity.Department{}, entity.Subject{})
	if err != nil {
		return err
	}

	// TODO:
	// seperate function to error handling
	return nil
}
