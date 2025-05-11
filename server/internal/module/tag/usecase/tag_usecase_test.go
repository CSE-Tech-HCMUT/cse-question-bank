package usecase_test

import (
	"context"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/tag/usecase"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockTagRepository is a mock implementation of the TagRepository interface
type MockTagRepository struct {
	mock.Mock
}

func (m *MockTagRepository) Create(ctx context.Context, db *gorm.DB, tag *entity.Tag) error {
	args := m.Called(ctx, db, tag)
	return args.Error(0)
}

func (m *MockTagRepository) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, db, conditionMap)
	return args.Error(0)
}

func (m *MockTagRepository) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Tag, error) {
	args := m.Called(ctx, db, conditionMap)
	return args.Get(0).([]*entity.Tag), args.Error(1)
}

func (m *MockTagRepository) Update(ctx context.Context, db *gorm.DB, tag *entity.Tag) error {
	args := m.Called(ctx, db, tag)
	return args.Error(0)
}

func (m *MockTagRepository) BeginTx(ctx context.Context) (*gorm.DB, error) {
	args := m.Called(ctx)
	return args.Get(0).(*gorm.DB), args.Error(1)
}

func TestCreateTag(t *testing.T) {
	mockTagRepo := new(MockTagRepository)
	tagUsecase := usecase.NewTagUsecase(mockTagRepo)

	ctx := context.Background()
	tag := &entity.Tag{
		Id:   1,
		Name: "Test Tag",
	}

	// Use a typed nil for *gorm.DB
	var mockDB *gorm.DB = nil

	// Update the mock expectation to use the typed nil
	mockTagRepo.On("Create", ctx, mockDB, tag).Return(nil)
	mockTagRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.Tag{tag}, nil)

	createdTag, err := tagUsecase.CreateTag(ctx, tag)

	assert.NoError(t, err)
	assert.NotNil(t, createdTag)
	assert.Equal(t, tag.Name, createdTag.Name)
	mockTagRepo.AssertExpectations(t)
}

func TestDeleteTag(t *testing.T) {
	mockTagRepo := new(MockTagRepository)
	tagUsecase := usecase.NewTagUsecase(mockTagRepo)

	ctx := context.Background()
	tagId := 1

	// Use a typed nil for *gorm.DB
	var mockDB *gorm.DB = nil

	mockTagRepo.On("Delete", ctx, mockDB, mock.Anything).Return(nil)

	err := tagUsecase.DeleteTag(ctx, tagId)

	assert.NoError(t, err)
	mockTagRepo.AssertExpectations(t)
}

func TestGetAllTag(t *testing.T) {
	mockTagRepo := new(MockTagRepository)
	tagUsecase := usecase.NewTagUsecase(mockTagRepo)

	ctx := context.Background()
	tags := []*entity.Tag{
		{Id: 1, Name: "Tag 1"},
		{Id: 2, Name: "Tag 2"},
	}

	// Use a typed nil for *gorm.DB
	var mockDB *gorm.DB = nil

	mockTagRepo.On("Find", ctx, mockDB, nil).Return(tags, nil)

	tagResponses, err := tagUsecase.GetAllTag(ctx)

	assert.NoError(t, err)
	assert.NotNil(t, tagResponses)
	assert.Equal(t, len(tags), len(tagResponses))
	mockTagRepo.AssertExpectations(t)
}

func TestGetTag(t *testing.T) {
	mockTagRepo := new(MockTagRepository)
	tagUsecase := usecase.NewTagUsecase(mockTagRepo)

	ctx := context.Background()
	tagId := 1
	tag := &entity.Tag{
		Id:   tagId,
		Name: "Test Tag",
	}

	// Use a typed nil for *gorm.DB
	var mockDB *gorm.DB = nil

	mockTagRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.Tag{tag}, nil)

	tagResponse, err := tagUsecase.GetTag(ctx, tagId)

	assert.NoError(t, err)
	assert.NotNil(t, tagResponse)
	assert.Equal(t, tag.Name, tagResponse.Name)
	mockTagRepo.AssertExpectations(t)
}

func TestUpdateTag(t *testing.T) {
	mockTagRepo := new(MockTagRepository)
	tagUsecase := usecase.NewTagUsecase(mockTagRepo)

	ctx := context.Background()
	tag := &entity.Tag{
		Id:   1,
		Name: "Updated Tag",
	}

	// Use a typed nil for *gorm.DB
	var mockDB *gorm.DB = nil


	mockTagRepo.On("Update", ctx, mockDB, tag).Return(nil)

	err := tagUsecase.UpdateTag(ctx, tag)

	assert.NoError(t, err)
	mockTagRepo.AssertExpectations(t)
}
