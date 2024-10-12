package repository

import (
	"context"
	"cse-question-bank/internal/module/tag_assignment/model/entity"

	"gorm.io/gorm"
)

type TagAssignmentRepository interface {
	Find(ctx context.Context, conditionMap map[string]interface{}) ([]*entity.TagAssignment, error)
	Delete(ctx context.Context, conditionMap map[string]interface{}) error
}

type tagAssignmentRepositoryImpl struct {
	db *gorm.DB
}

func NewTagAssignmentRepository(db *gorm.DB) TagAssignmentRepository {
	return tagAssignmentRepositoryImpl{
		db: db,
	}
}

func (t tagAssignmentRepositoryImpl) Find(
	ctx context.Context,
	conditionMap map[string]interface{},
) ([]*entity.TagAssignment, error) {

	var tagAssignments []*entity.TagAssignment
	if err := t.db.Where(conditionMap).Find(&tagAssignments).Error; err != nil {
		return nil, err
	}

	return tagAssignments, nil
}

func (t tagAssignmentRepositoryImpl) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	if err := t.db.Where(conditionMap).Delete(&entity.TagAssignment{}).Error; err != nil {
		return err
	}

	return nil
}

func (t tagAssignmentRepositoryImpl) Update(ctx context.Context, tagAssignment *entity.TagAssignment) error {
	if err := t.db.Updates(tagAssignment).Error; err != nil {
		return err
	}
	return nil
}