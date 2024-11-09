package database

import (
	ee "cse-question-bank/internal/module/exam/model/entity"
	qe "cse-question-bank/internal/module/question/model/entity"
	te "cse-question-bank/internal/module/tag/model/entity"
	tae "cse-question-bank/internal/module/tag_assignment/model/entity"
	oe "cse-question-bank/internal/module/tag_option/model/entity"

	"gorm.io/gorm"
)

func DataMigrate(db *gorm.DB) error {
	// migrate for question
	err := db.AutoMigrate(qe.Question{}, qe.Answer{})
	if err != nil {
		return err
	}
	err = db.AutoMigrate(te.Tag{}, oe.Option{}, tae.TagAssignment{})
	if err != nil {
		return err
	}
	err = db.AutoMigrate(ee.Exam{}, ee.FilterCondition{}, ee.FilterTagAssignment{})

	// TODO:
	// seperate function to error handling
	return nil
}
