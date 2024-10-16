package database

import (
	"cse-question-bank/internal/module/question/model"
	tag_entity "cse-question-bank/internal/module/tag/model/entity"
	tae "cse-question-bank/internal/module/tag_assignment/model/entity"
	option_entity "cse-question-bank/internal/module/tag_option/model/entity"

	"gorm.io/gorm"
)

func DataMigrate(db *gorm.DB) error {
	// migrate for question
	err := db.AutoMigrate(model.Question{}, model.Answer{})
	if err != nil {
		return err
	}
	err = db.AutoMigrate(tag_entity.Tag{}, option_entity.Option{}, tae.TagAssignment{})
	if err != nil {
		return err
	}

	// TODO:
	// seperate function to error handling
	return nil
}
