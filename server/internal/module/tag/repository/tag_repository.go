package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

type TagRepository interface {
	Create(ctx context.Context, db *gorm.DB, tag *entity.Tag) error
	Update(ctx context.Context, db *gorm.DB, tag *entity.Tag) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Tag, error)

	// BeginTx(ctx context.Context) (*gorm.DB, error)
	// RollBackTx(tx *gorm.DB) error
	// CommitTx(tx *gorm.DB) error
}

type tagRepositoryImpl struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *tagRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *tagRepositoryImpl) Create(ctx context.Context, db *gorm.DB, tag *entity.Tag) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(tag).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *tagRepositoryImpl) Update(ctx context.Context, db *gorm.DB, tag *entity.Tag) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(tag).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *tagRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Select("Options").Delete(&entity.Tag{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *tagRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Tag, error) {
	var tags []*entity.Tag
	tx := r.getDB(ctx, db)
	if err := tx.Preload("Options").Preload("Subject.Department").Where(conditionMap).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

// Transaction methods
func (r *tagRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *tagRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *tagRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
