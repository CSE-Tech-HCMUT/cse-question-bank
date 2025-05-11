package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(ctx context.Context, db *gorm.DB, user *entity.User) error
	Update(ctx context.Context, db *gorm.DB, user *entity.User) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.User, error)

	// BeginTx(ctx context.Context) (*gorm.DB, error)
	// RollBackTx(tx *gorm.DB) error
	// CommitTx(tx *gorm.DB) error
}

type userRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *userRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *userRepositoryImpl) Create(ctx context.Context, db *gorm.DB, user *entity.User) error {
	tx := r.getDB(ctx, db)
	if err := tx.Create(user).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *userRepositoryImpl) Update(ctx context.Context, db *gorm.DB, user *entity.User) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(user).Error; err != nil {
		return err
	}
	return nil
}

// Delete
func (r *userRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.User{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *userRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.User, error) {
	var users []*entity.User
	tx := r.getDB(ctx, db)
	if err := tx.Where(conditionMap).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// // Transaction methods
// func (r *userRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
// 	tx := r.db.WithContext(ctx).Begin()
// 	return tx, tx.Error
// }

// func (r *userRepositoryImpl) RollBackTx(tx *gorm.DB) error {
// 	return tx.Rollback().Error
// }

// func (r *userRepositoryImpl) CommitTx(tx *gorm.DB) error {
// 	return tx.Commit().Error
// }
