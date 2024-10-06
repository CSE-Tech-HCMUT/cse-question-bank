package repository

import "gorm.io/gorm"

type OptionRepository interface{}

type optionRepositoryImpl struct {
	db *gorm.DB
}

func NewOptionRepository(db *gorm.DB) OptionRepository {
	return &optionRepositoryImpl{
		db: db,
	}
}

