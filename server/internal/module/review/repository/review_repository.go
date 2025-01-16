package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(ctx context.Context, db *gorm.DB, review *entity.ReviewRequest) error
	Update(ctx context.Context, db *gorm.DB, review *entity.ReviewRequest) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.ReviewRequest, error)

	BeginTx(ctx context.Context) (*gorm.DB, error)
	RollBackTx(tx *gorm.DB) error
	CommitTx(tx *gorm.DB) error
}

type reviewRepositoryImpl struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *reviewRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *reviewRepositoryImpl) Create(ctx context.Context, db *gorm.DB, review *entity.ReviewRequest) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(review).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *reviewRepositoryImpl) Update(ctx context.Context, db *gorm.DB, review *entity.ReviewRequest) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(review).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *reviewRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.ReviewRequest{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *reviewRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.ReviewRequest, error) {
	var reviews []*entity.ReviewRequest
	tx := r.getDB(ctx, db)

	if err := tx.Where(conditionMap).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

// Transaction methods
func (r *reviewRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *reviewRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *reviewRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
