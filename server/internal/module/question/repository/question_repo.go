package repository

import (
	"context"
	"cse-question-bank/internal/module/question/model"

	"gorm.io/gorm"
)

type QuestionRepository interface{}

type questionRepositoryImpl struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepositoryImpl{
		db: db,
	}
}

func (r questionRepositoryImpl) Create(ctx context.Context, question *model.Question) error {
	return nil
}

func (r questionRepositoryImpl) Update(ctx context.Context, question *model.Question) error {
	return nil
}

func (r questionRepositoryImpl) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	return nil
}

func (r questionRepositoryImpl) Find(ctx context.Context, conditionMap map[string]interface{}) error {
	return nil
}