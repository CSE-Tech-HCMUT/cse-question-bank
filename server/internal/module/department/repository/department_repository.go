package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

type DepartmentRepository interface {
	Create(ctx context.Context, db *gorm.DB, department *entity.Department) error
	Update(ctx context.Context, db *gorm.DB, department *entity.Department) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Department, error)

	BeginTx(ctx context.Context) (*gorm.DB, error)
	RollBackTx(tx *gorm.DB) error
	CommitTx(tx *gorm.DB) error
}

type departmentRepositoryImpl struct {
	db *gorm.DB
}

func NewDepartmentRepository(db *gorm.DB) DepartmentRepository {
	return &departmentRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *departmentRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *departmentRepositoryImpl) Create(ctx context.Context, db *gorm.DB, department *entity.Department) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(department).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *departmentRepositoryImpl) Update(ctx context.Context, db *gorm.DB, department *entity.Department) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(department).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *departmentRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.Department{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *departmentRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Department, error) {
	var departments []*entity.Department
	tx := r.getDB(ctx, db)
	if err := tx.Where(conditionMap).Find(&departments).Error; err != nil {
		return nil, err
	}
	return departments, nil
}

// Transaction methods
func (r *departmentRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *departmentRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *departmentRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
