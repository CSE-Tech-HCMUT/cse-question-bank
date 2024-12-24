package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

type SubjectRepository interface {
	Create(ctx context.Context, db *gorm.DB, subject *entity.Subject) error
	Update(ctx context.Context, db *gorm.DB, subject *entity.Subject) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Subject, error)

	BeginTx(ctx context.Context) (*gorm.DB, error)
	RollBackTx(tx *gorm.DB) error
	CommitTx(tx *gorm.DB) error
}

type subjectRepositoryImpl struct {
	db *gorm.DB
}

func NewSubjectRepository(db *gorm.DB) SubjectRepository {
	return &subjectRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *subjectRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *subjectRepositoryImpl) Create(ctx context.Context, db *gorm.DB, subject *entity.Subject) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(subject).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *subjectRepositoryImpl) Update(ctx context.Context, db *gorm.DB, subject *entity.Subject) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(subject).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *subjectRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.Subject{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *subjectRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Subject, error) {
	var subjects []*entity.Subject
	tx := r.getDB(ctx, db)
	if err := tx.Preload("Department").Where(conditionMap).Find(&subjects).Error; err != nil {
		return nil, err
	}
	return subjects, nil
}

// Transaction methods
func (r *subjectRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *subjectRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *subjectRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
