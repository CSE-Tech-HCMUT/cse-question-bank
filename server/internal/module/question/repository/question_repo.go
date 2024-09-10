package repository

import (
	"context"
	"cse-question-bank/internal/module/question/model/entity"

	"gorm.io/gorm"
)

type QuestionRepository interface {
	Create(ctx context.Context, db *gorm.DB, question *entity.Question) error
	Update(ctx context.Context, db *gorm.DB, question *entity.Question) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Question, error)

	BeginTx(ctx context.Context) (*gorm.DB, error)
	RollBackTx(tx *gorm.DB) error
	CommitTx(tx *gorm.DB) error
}

type questionRepositoryImpl struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *questionRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *questionRepositoryImpl) Create(ctx context.Context, db *gorm.DB, question *entity.Question) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(question).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *questionRepositoryImpl) Update(ctx context.Context, db *gorm.DB, question *entity.Question) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(question).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *questionRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.Question{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *questionRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Question, error) {
	var questions []*entity.Question
	tx := r.getDB(ctx, db)
	if err := tx.Preload("Answer").Where(conditionMap).Find(&questions).Error; err != nil {
		return nil, err
	}
	return questions, nil
}

// Transaction methods
func (r *questionRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *questionRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *questionRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
