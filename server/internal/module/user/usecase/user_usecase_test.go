// filepath: server/internal/module/user/usecase/create_user_usecase_test.go
package usecase_test

import (
	"context"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/user/model/req"
	"cse-question-bank/internal/module/user/usecase"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockUserRepository is a mock implementation of the UserRepository interface
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(ctx context.Context, db *gorm.DB, user *entity.User) error {
	args := m.Called(ctx, db, user)
	return args.Error(0)
}

func (m *MockUserRepository) Update(ctx context.Context, db *gorm.DB, user *entity.User) error {
	args := m.Called(ctx, db, user)
	return args.Error(0)
}

func (m *MockUserRepository) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, db, conditionMap)
	return args.Error(0)
}

func (m *MockUserRepository) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.User, error) {
	args := m.Called(ctx, db, conditionMap)
	return args.Get(0).([]*entity.User), args.Error(1)
}

func TestCreateUser(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userUsecase := usecase.NewUserUsecase(mockRepo)

	ctx := context.Background()
	request := &req.CreateUserRequest{
		Mail:     "test@example.com",
		Username: "testuser",
		Role:     "admin",
	}
	userEntity := request.ToEntity()

	var mockDB *gorm.DB = nil

	mockRepo.On("Create", ctx, mockDB, userEntity).Return(nil)

	response, err := userUsecase.CreateUser(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, request.Mail, response.Mail)
	mockRepo.AssertExpectations(t)
}

func TestDeleteUser(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userUsecase := usecase.NewUserUsecase(mockRepo)

	ctx := context.Background()
	userId := uuid.New()

	var mockDB *gorm.DB = nil

	mockRepo.On("Delete", ctx, mockDB, mock.Anything).Return(nil)

	err := userUsecase.DeleteUser(ctx, userId)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestGetUserById(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userUsecase := usecase.NewUserUsecase(mockRepo)

	ctx := context.Background()
	userId := uuid.New()
	userEntity := &entity.User{
		Id:       userId,
		Mail:     "test@example.com",
		Username: "testuser",
		Role:     "admin",
	}

	var mockDB *gorm.DB = nil

	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.User{userEntity}, nil)

	response, err := userUsecase.GetUserById(ctx, userId)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, userEntity.Mail, response.Mail)
	mockRepo.AssertExpectations(t)
}

func TestGetAllUsers(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userUsecase := usecase.NewUserUsecase(mockRepo)

	ctx := context.Background()
	users := []*entity.User{
		{
			Id:       uuid.New(),
			Mail:     "test1@example.com",
			Username: "testuser1",
			Role:     "admin",
		},
		{
			Id:       uuid.New(),
			Mail:     "test2@example.com",
			Username: "testuser2",
			Role:     "user",
		},
	}

	var mockDB *gorm.DB = nil

	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(users, nil)

	response, err := userUsecase.GetAllUsers(ctx)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, len(users), len(response))
	mockRepo.AssertExpectations(t)
}

func TestUpdateUserProfile(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userUsecase := usecase.NewUserUsecase(mockRepo)

	ctx := context.Background()
	request := req.UpdateUserProfile{
		Id: uuid.New(),
	}
	userEntity := request.ToEntity()

	var mockDB *gorm.DB = nil

	mockRepo.On("Update", ctx, mockDB, userEntity).Return(nil)

	response, err := userUsecase.UpdateUserProfile(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, request.Department, response.Department)
	mockRepo.AssertExpectations(t)
}
