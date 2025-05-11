package usecase_test

import (
	"context"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/department/model/req"
	"cse-question-bank/internal/module/department/usecase"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockDepartmentRepository is a mock implementation of the DepartmentRepository interface
type MockDepartmentRepository struct {
	mock.Mock
}

func (m *MockDepartmentRepository) Create(ctx context.Context, db *gorm.DB, department *entity.Department) error {
	args := m.Called(ctx, db, department)
	return args.Error(0)
}

func (m *MockDepartmentRepository) Update(ctx context.Context, db *gorm.DB, department *entity.Department) error {
	args := m.Called(ctx, db, department)
	return args.Error(0)
}

func (m *MockDepartmentRepository) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, db, conditionMap)
	return args.Error(0)
}

func (m *MockDepartmentRepository) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Department, error) {
	args := m.Called(ctx, db, conditionMap)
	return args.Get(0).([]*entity.Department), args.Error(1)
}

func TestCreateDepartment(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	request := &req.CreateDepartmentRequest{
		Code: "CSE",
		Name: "Computer Science and Engineering",
	}

	department := request.ToEntity()
	var mockDB *gorm.DB = nil

	mockRepo.On("Create", ctx, mockDB, department).Return(nil)

	response, err := departmentUsecase.CreateDepartment(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, request.Code, response.Code)
	assert.Equal(t, request.Name, response.Name)
	mockRepo.AssertExpectations(t)
}

func TestDeleteDepartment(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	departmentCode := "CSE"
	var mockDB *gorm.DB = nil

	mockRepo.On("Delete", ctx, mockDB, map[string]interface{}{
		"code": departmentCode,
	}).Return(nil)

	err := departmentUsecase.DeleteDepartment(ctx, departmentCode)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestGetAllDepartments(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	departments := []*entity.Department{
		{
			Code: "CSE",
			Name: "Computer Science and Engineering",
		},
		{
			Code: "EEE",
			Name: "Electrical and Electronic Engineering",
		},
	}

	// Change the mock expectation to match what the implementation is calling
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(departments, nil)

	responses, err := departmentUsecase.GetAllDepartments(ctx)

	assert.NoError(t, err)
	assert.NotNil(t, responses)
	assert.Equal(t, len(departments), len(responses))
	assert.Equal(t, departments[0].Code, responses[0].Code)
	assert.Equal(t, departments[1].Code, responses[1].Code)
	mockRepo.AssertExpectations(t)
}

func TestGetDepartmentByCode(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	departmentCode := "CSE"
	var mockDB *gorm.DB = nil

	department := &entity.Department{
		Code: departmentCode,
		Name: "Computer Science and Engineering",
	}

	mockRepo.On("Find", ctx, mockDB, map[string]interface{}{
		"code": departmentCode,
	}).Return([]*entity.Department{department}, nil)

	response, err := departmentUsecase.GetDepartmentByCode(ctx, departmentCode)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, departmentCode, response.Code)
	assert.Equal(t, department.Name, response.Name)
	mockRepo.AssertExpectations(t)
}

func TestUpdateDepartment(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	request := req.UpdateDepartmentRequest{
		Code: "CSE",
		Name: "Updated Computer Science and Engineering",
	}

	department := request.ToEntity()
	var mockDB *gorm.DB = nil

	mockRepo.On("Update", ctx, mockDB, department).Return(nil)

	response, err := departmentUsecase.UpdateDepartment(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, request.Code, response.Code)
	assert.Equal(t, request.Name, response.Name)
	mockRepo.AssertExpectations(t)
}

// Test error cases
func TestCreateDepartment_Error(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	request := &req.CreateDepartmentRequest{
		Code: "CSE",
		Name: "Computer Science and Engineering",
	}

	department := request.ToEntity()
	var mockDB *gorm.DB = nil

	expectedErr := gorm.ErrInvalidDB
	mockRepo.On("Create", ctx, mockDB, department).Return(expectedErr)

	response, err := departmentUsecase.CreateDepartment(ctx, request)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, response)
	mockRepo.AssertExpectations(t)
}

func TestGetAllDepartments_Error(t *testing.T) {
	mockRepo := new(MockDepartmentRepository)
	departmentUsecase := usecase.NewDepartmentUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	expectedErr := gorm.ErrRecordNotFound
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.Department{}, expectedErr)

	responses, err := departmentUsecase.GetAllDepartments(ctx)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, responses)
	mockRepo.AssertExpectations(t)
}
