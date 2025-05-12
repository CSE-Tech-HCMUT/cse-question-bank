package repository

import (
	"context"
	"cse-question-bank/internal/database/entity"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ExamRepository interface {
	Create(ctx context.Context, db *gorm.DB, exam *entity.Exam) error
	Update(ctx context.Context, db *gorm.DB, exam *entity.Exam) error
	Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error
	Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Exam, error)
	// UpdateExamQuestions(ctx context.Context, db *gorm.DB, examID uint, questionIDs []uint) error
	BeginTx(ctx context.Context) (*gorm.DB, error)
	RollBackTx(tx *gorm.DB) error
	CommitTx(tx *gorm.DB) error
}

type examRepositoryImpl struct {
	db *gorm.DB
}

func NewExamRepository(db *gorm.DB) ExamRepository {
	return &examRepositoryImpl{
		db: db,
	}
}

// getDB will use the transaction db if passed, otherwise use the default DB connection.
func (r *examRepositoryImpl) getDB(ctx context.Context, db *gorm.DB) *gorm.DB {
	if db != nil {
		return db.WithContext(ctx)
	}
	return r.db.WithContext(ctx)
}

// Create
func (r *examRepositoryImpl) Create(ctx context.Context, db *gorm.DB, exam *entity.Exam) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Create(exam).Error; err != nil {
		return err
	}
	return nil
}

// Update
func (r *examRepositoryImpl) Update(ctx context.Context, db *gorm.DB, exam *entity.Exam) error {
	tx := r.getDB(ctx, db)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(exam).Error; err != nil {
		return err
	}
	return nil
}

// UpdateExamQuestions updates the list of questions in an exam by their IDs.
func (r *examRepositoryImpl) UpdateExamQuestions(ctx context.Context, db *gorm.DB, examID uint, questionIDs []uint) error {
    tx := r.getDB(ctx, db)

    // Retrieve the exam to update its questions
    var exam entity.Exam
    if err := tx.Preload("Questions").First(&exam, examID).Error; err != nil {
        return err
    }

    // Retrieve the questions by the provided IDs
    var questions []entity.Question
    if err := tx.Where("id IN ?", questionIDs).Find(&questions).Error; err != nil {
        return err
    }

    // Update the exam's questions association
    if err := tx.Model(&exam).Association("Questions").Replace(questions); err != nil {
        return err
    }

    return nil
}

// Delete
func (r *examRepositoryImpl) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	tx := r.getDB(ctx, db)
	if err := tx.Delete(&entity.Exam{}, conditionMap).Error; err != nil {
		return err
	}
	return nil
}

// Find
func (r *examRepositoryImpl) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Exam, error) {
	var exams []*entity.Exam
	tx := r.getDB(ctx, db)
	if err := tx.Preload(clause.Associations).
		Preload("Questions." + clause.Associations).
		Preload("Questions.TagAssignments." + clause.Associations).
		Preload("FilterConditions.FilterTagAssignments." + clause.Associations).
		Preload("ParentExam." + clause.Associations). // Preload parent exam
		Preload("Children." + clause.Associations).   // Preload child exams
		Where(conditionMap).Find(&exams).Error; err != nil {
		return nil, err
	}
	return exams, nil
}

// Transaction methods
func (r *examRepositoryImpl) BeginTx(ctx context.Context) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Begin()
	return tx, tx.Error
}

func (r *examRepositoryImpl) RollBackTx(tx *gorm.DB) error {
	return tx.Rollback().Error
}

func (r *examRepositoryImpl) CommitTx(tx *gorm.DB) error {
	return tx.Commit().Error
}
