package repository

import (
	"context"
	"cse-question-bank/internal/module/tag_option/model/entity"

	"gorm.io/gorm"
)

type OptionRepository interface{
	Delete(ctx context.Context, conditionMap map[string]interface{}) error
}

type optionRepositoryImpl struct {
	db *gorm.DB
}

func NewOptionRepository(db *gorm.DB) OptionRepository {
	return &optionRepositoryImpl{
		db: db,
	}
}

func (r optionRepositoryImpl) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	if err := r.db.Where(conditionMap).Delete(&entity.Option{}).Error; err != nil {
		return err
	}

	return nil
}