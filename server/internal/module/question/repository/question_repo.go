package repository

import (
	"context"
	"cse-question-bank/internal/module/question/model"

	"gorm.io/gorm"
)

type QuestionRepository interface{
	Create(ctx context.Context, question *model.Question) error 
	Update(ctx context.Context, question *model.Question) error
	Delete(ctx context.Context, conditionMap map[string]interface{}) error
	Find(ctx context.Context, conditionMap map[string]interface{}) ([]*model.Question, error)
}

type questionRepositoryImpl struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepositoryImpl{
		db: db,
	}
}

func (r *questionRepositoryImpl) getDB(ctx context.Context) *gorm.DB {
	return r.db.WithContext(ctx)
}

func (r questionRepositoryImpl) Create(ctx context.Context, question *model.Question) error {
	db := r.getDB(ctx)
	if err := db.Create(question).Error; err != nil {
		return err
	}
	
	return nil
}

func (r questionRepositoryImpl) Update(ctx context.Context, question *model.Question) error {
	db := r.getDB(ctx)
	if err := db.Updates(question).Error; err != nil {
		return err
	}

	return nil
}

func (r questionRepositoryImpl) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	db := r.getDB(ctx)
	if err := db.Delete(&model.Question{}, conditionMap).Error; err != nil {
		return err
	}

	return nil
}

func (r questionRepositoryImpl) Find(ctx context.Context, conditionMap map[string]interface{}) ([]*model.Question, error) {
	var questions []*model.Question
	db := r.getDB(ctx)
	if err := db.Find(questions, conditionMap).Error; err != nil {
		return nil, err
	}

	return questions, nil
}