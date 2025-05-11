package usecase_test

import (
	"context"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/subject/model/req"
	"cse-question-bank/internal/module/subject/usecase"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockSubjectRepository is a mock implementation of the SubjectRepository interface
type MockSubjectRepository struct {
	mock.Mock
}

func (m *MockSubjectRepository) Create(ctx context.Context, db *gorm.DB, subject *entity.Subject) error {
	args := m.Called(ctx, db, subject)
	return args.Error(0)
}

func (m *MockSubjectRepository) Update(ctx context.Context, db *gorm.DB, subject *entity.Subject) error {
	args := m.Called(ctx, db, subject)
	return args.Error(0)
}

func (m *MockSubjectRepository) Delete(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) error {
	args := m.Called(ctx, db, conditionMap)
	return args.Error(0)
}

func (m *MockSubjectRepository) Find(ctx context.Context, db *gorm.DB, conditionMap map[string]interface{}) ([]*entity.Subject, error) {
	args := m.Called(ctx, db, conditionMap)
	return args.Get(0).([]*entity.Subject), args.Error(1)
}

func (m *MockSubjectRepository) BeginTx(ctx context.Context) (*gorm.DB, error) {
	args := m.Called(ctx)
	return args.Get(0).(*gorm.DB), args.Error(1)
}

func (m *MockSubjectRepository) RollBackTx(tx *gorm.DB) error {
	args := m.Called(tx)
	return args.Error(0)
}

func (m *MockSubjectRepository) CommitTx(tx *gorm.DB) error {
	args := m.Called(tx)
	return args.Error(0)
}

func TestCreateSubject(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subject := &entity.Subject{
		Name: "Test Subject",
		Code: "SUB001",
	}

	var mockDB *gorm.DB = nil

	// Use mock.AnythingOfType to allow any UUID for the Id field
	mockRepo.On("Create", ctx, mockDB, mock.MatchedBy(func(s *entity.Subject) bool {
		return s.Name == subject.Name && s.Code == subject.Code
	})).Return(nil)

	request := &req.CreateSubjectRequest{
		Name: subject.Name,
		Code: subject.Code,
	}

	// Simulate the use case generating the same UUID
	// mockRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.Subject{subject}, nil)

	createdSubject, err := subjectUsecase.CreateSubject(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, createdSubject)
	assert.Equal(t, subject.Name, createdSubject.Name)
	mockRepo.AssertExpectations(t)
}

func TestCreateSubject_Error(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subject := &entity.Subject{
		Name: "Test Subject",
		Code: "SUB001",
	}

	var mockDB *gorm.DB = nil

	// Simulate an error in the Create method
	mockRepo.On("Create", ctx, mockDB, mock.Anything).Return(gorm.ErrInvalidData)

	request := &req.CreateSubjectRequest{
		Name: subject.Name,
		Code: subject.Code,
	}

	createdSubject, err := subjectUsecase.CreateSubject(ctx, request)

	assert.Error(t, err)
	assert.Nil(t, createdSubject)
	mockRepo.AssertExpectations(t)
}

// func TestCreateSubject_TransactionRollback(t *testing.T) {
// 	mockRepo := new(MockSubjectRepository)
// 	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

// 	ctx := context.Background()
// 	subject := &entity.Subject{
// 		Name: "Test Subject",
// 		Code: "SUB001",
// 	}

// 	mockTx := new(gorm.DB)

// 	// Simulate transaction behavior
// 	mockRepo.On("BeginTx", ctx).Return(mockTx, nil)
// 	mockRepo.On("Create", ctx, mockTx, mock.Anything).Return(gorm.ErrInvalidData)
// 	mockRepo.On("RollBackTx", mockTx).Return(nil)

// 	request := &req.CreateSubjectRequest{
// 		Name: subject.Name,
// 		Code: subject.Code,
// 	}

// 	createdSubject, err := subjectUsecase.CreateSubject(ctx, request)

// 	assert.Error(t, err)
// 	assert.Nil(t, createdSubject)
// 	mockRepo.AssertExpectations(t)
// }

func TestUpdateSubject(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subject := &entity.Subject{
		Id:   uuid.New(),
		Name: "Updated Subject",
		Code: "SUB002",
	}

	var mockDB *gorm.DB = nil

	mockRepo.On("Update", ctx, mockDB, subject).Return(nil)

	request := &req.UpdateSubjectRequest{
		Id:   subject.Id,
		Name: subject.Name,
		Code: subject.Code,
	}

	updatedSubject, err := subjectUsecase.UpdateSubject(ctx, request)

	assert.NoError(t, err)
	assert.NotNil(t, updatedSubject)
	assert.Equal(t, subject.Name, updatedSubject.Name)
	mockRepo.AssertExpectations(t)
}

func TestUpdateSubject_Error(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subject := &entity.Subject{
		Id:   uuid.New(),
		Name: "Updated Subject",
		Code: "SUB002",
	}

	var mockDB *gorm.DB = nil

	// Simulate an error in the Update method
	mockRepo.On("Update", ctx, mockDB, mock.Anything).Return(gorm.ErrInvalidData)

	request := &req.UpdateSubjectRequest{
		Id:   subject.Id,
		Name: subject.Name,
		Code: subject.Code,
	}

	updatedSubject, err := subjectUsecase.UpdateSubject(ctx, request)

	assert.Error(t, err)
	assert.Nil(t, updatedSubject)
	mockRepo.AssertExpectations(t)
}

func TestGetAllSubjects(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subjects := []*entity.Subject{
		{Id: uuid.New(), Name: "Subject 1", Code: "SUB001"},
		{Id: uuid.New(), Name: "Subject 2", Code: "SUB002"},
	}

	var mockDB *gorm.DB = nil

	// Use mock.Anything for the conditionMap argument to allow any value
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(subjects, nil)

	subjectResponses, err := subjectUsecase.GetAllSubjects(ctx)

	assert.NoError(t, err)
	assert.NotNil(t, subjectResponses)
	assert.Equal(t, len(subjects), len(subjectResponses))
	mockRepo.AssertExpectations(t)
}

func TestGetAllSubjects_Empty(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()

	var mockDB *gorm.DB = nil

	// Simulate no subjects found
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return([]*entity.Subject{}, nil)

	subjectResponses, err := subjectUsecase.GetAllSubjects(ctx)

	assert.NoError(t, err)
	assert.NotNil(t, subjectResponses)
	assert.Equal(t, 0, len(subjectResponses))
	mockRepo.AssertExpectations(t)
}

func TestGetAllSubjects_Error(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()

	var mockDB *gorm.DB = nil

	// Simulate an error in the Find method
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(([]*entity.Subject)(nil), gorm.ErrInvalidData)

	subjectResponses, err := subjectUsecase.GetAllSubjects(ctx)

	assert.Error(t, err)
	assert.Nil(t, subjectResponses)
	mockRepo.AssertExpectations(t)
}

func TestDeleteSubject(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subjectId := uuid.New()

	var mockDB *gorm.DB = nil

	mockRepo.On("Delete", ctx, mockDB, mock.Anything).Return(nil)

	err := subjectUsecase.DeleteSubject(ctx, subjectId)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestDeleteSubject_Error(t *testing.T) {
	mockRepo := new(MockSubjectRepository)
	subjectUsecase := usecase.NewSubjectUsecase(mockRepo)

	ctx := context.Background()
	subjectId := uuid.New()

	var mockDB *gorm.DB = nil

	// Simulate an error in the Delete method
	mockRepo.On("Delete", ctx, mockDB, mock.Anything).Return(gorm.ErrInvalidData)

	err := subjectUsecase.DeleteSubject(ctx, subjectId)

	assert.Error(t, err)
	mockRepo.AssertExpectations(t)
}
