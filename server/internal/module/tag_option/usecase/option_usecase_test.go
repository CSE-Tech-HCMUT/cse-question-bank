package usecase_test

import (
	"context"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/tag_option/usecase"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockOptionRepository is a mock implementation of the OptionRepository interface
type MockOptionRepository struct {
	mock.Mock
}

func (m *MockOptionRepository) Create(ctx context.Context, option *entity.Option) error {
	args := m.Called(ctx, option)
	return args.Error(0)
}

func (m *MockOptionRepository) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, conditionMap)
	return args.Error(0)
}

// MockTagAssignmentRepository is a mock implementation of the TagAssignmentRepository interface
type MockTagAssignmentRepository struct {
	mock.Mock
}

func (m *MockTagAssignmentRepository) Find(ctx context.Context, conditionMap map[string]interface{}) ([]*entity.TagAssignment, error) {
	args := m.Called(ctx, conditionMap)
	return args.Get(0).([]*entity.TagAssignment), args.Error(1)
}

func (m *MockTagAssignmentRepository) Delete(ctx context.Context, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, conditionMap)
	return args.Error(0)
}

func TestGetUsedOption(t *testing.T) {
	mockOptionRepo := new(MockOptionRepository)
	mockTagAssignmentRepo := new(MockTagAssignmentRepository)
	optionUsecase := usecase.NewOptionUsecase(mockOptionRepo, mockTagAssignmentRepo)

	ctx := context.Background()
	optionId := 1
	tagAssignments := []*entity.TagAssignment{
		{Id: 1, OptionId: optionId},
		{Id: 2, OptionId: optionId},
	}

	mockTagAssignmentRepo.On("Find", ctx, mock.Anything).Return(tagAssignments, nil)

	count, err := optionUsecase.GetUsedOption(ctx, optionId)

	assert.NoError(t, err)
	assert.Equal(t, len(tagAssignments), count)
	mockTagAssignmentRepo.AssertExpectations(t)
}

func TestDeleteOption(t *testing.T) {
	mockOptionRepo := new(MockOptionRepository)
	mockTagAssignmentRepo := new(MockTagAssignmentRepository)
	optionUsecase := usecase.NewOptionUsecase(mockOptionRepo, mockTagAssignmentRepo)

	ctx := context.Background()
	optionId := 1

	// Mock no tag assignments found
	mockTagAssignmentRepo.On("Find", ctx, mock.Anything).Return([]*entity.TagAssignment{}, nil)
	mockOptionRepo.On("Delete", ctx, mock.Anything).Return(nil)

	err := optionUsecase.DeleteOption(ctx, optionId)

	assert.NoError(t, err)
	mockTagAssignmentRepo.AssertExpectations(t)
	mockOptionRepo.AssertExpectations(t)
}

func TestCreateOption(t *testing.T) {
	mockOptionRepo := new(MockOptionRepository)
	mockTagAssignmentRepo := new(MockTagAssignmentRepository) // Not used in this test
	optionUsecase := usecase.NewOptionUsecase(mockOptionRepo, mockTagAssignmentRepo)

	ctx := context.Background()
	option := &entity.Option{
		Id:   1,
		Name: "Test Option",
	}

	mockOptionRepo.On("Create", ctx, option).Return(nil)

	createdOption, err := optionUsecase.CreateOption(ctx, option)

	assert.NoError(t, err)
	assert.Equal(t, option, createdOption)
	mockOptionRepo.AssertExpectations(t)
}
