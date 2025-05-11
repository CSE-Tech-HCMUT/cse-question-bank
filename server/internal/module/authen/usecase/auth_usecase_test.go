package usecase_test

import (
	"context"
	"errors"
	"os"
	"testing"

	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/authen/model/req"
	"cse-question-bank/internal/module/authen/usecase"
	"cse-question-bank/pkg/hash"

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

func setupTestEnv() {
	// Setup environment variables for tests
	os.Setenv("JWT_SECRET_ACCESS_KEY", "test_access_secret")
	os.Setenv("JWT_SECRET_REFRESH_KEY", "test_refresh_secret")
	os.Setenv("JWT_ACCESS_EXPIRY", "3600")
	os.Setenv("JWT_REFRESH_EXPIRY", "86400")
}

func TestLogin(t *testing.T) {
	setupTestEnv()
	mockRepo := new(MockUserRepository)
	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	// Test case: successful login
	t.Run("Successful login", func(t *testing.T) {
		// Create a test user with a valid password
		testPassword := "password123"
		hashedPassword, _ := hash.Generate(testPassword)
		userId := uuid.New()

		user := []*entity.User{
			{
				Id:       userId,
				Username: "testuser",
				Password: hashedPassword,
				Role:     "user",
			},
		}

		// Mock the Find method to return our test user
		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
			username, ok := condition["username"].(string)
			return ok && username == "testuser"
		})).Return(user, nil).Once()

		// Call the Login method
		request := &req.LoginRequest{
			Username: "testuser",
			Password: testPassword,
		}

		accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

		// Assertions
		assert.NoError(t, err)
		assert.NotEmpty(t, accessToken)
		assert.NotEmpty(t, refreshToken)
		mockRepo.AssertExpectations(t)
	})

	// Test case: user not found
	t.Run("User not found", func(t *testing.T) {
		// Mock the Find method to return an empty array (no users found)
		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
			username, ok := condition["username"].(string)
			return ok && username == "nonexistentuser"
		})).Return([]*entity.User{}, nil).Once()

		// Call the Login method
		request := &req.LoginRequest{
			Username: "nonexistentuser",
			Password: "anypassword",
		}

		accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

		// Assertions
		assert.Error(t, err)
		assert.Equal(t, "no account", err.Error())
		assert.Empty(t, accessToken)
		assert.Empty(t, refreshToken)
		mockRepo.AssertExpectations(t)
	})

	// Test case: incorrect password
	t.Run("Incorrect password", func(t *testing.T) {
		// Create a test user with a known password
		testPassword := "password123"
		hashedPassword, _ := hash.Generate(testPassword)
		userId := uuid.New()

		user := []*entity.User{
			{
				Id:       userId,
				Username: "testuser",
				Password: hashedPassword,
				Role:     "user",
			},
		}

		// Mock the Find method to return our test user
		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
			username, ok := condition["username"].(string)
			return ok && username == "testuser"
		})).Return(user, nil).Once()

		// Call the Login method with incorrect password
		request := &req.LoginRequest{
			Username: "testuser",
			Password: "wrongpassword",
		}

		accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

		// Assertions
		assert.Error(t, err)
		assert.Equal(t, "try again", err.Error())
		assert.Empty(t, accessToken)
		assert.Empty(t, refreshToken)
		mockRepo.AssertExpectations(t)
	})

	// Test case: repository error
	t.Run("Repository error", func(t *testing.T) {
		expectedErr := errors.New("database error")

		// Mock the Find method to return an error
		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
			username, ok := condition["username"].(string)
			return ok && username == "testuser"
		})).Return([]*entity.User{}, expectedErr).Once()

		// Call the Login method
		request := &req.LoginRequest{
			Username: "testuser",
			Password: "password123",
		}

		accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

		// Assertions
		assert.Error(t, err)
		assert.Equal(t, expectedErr, err)
		assert.Empty(t, accessToken)
		assert.Empty(t, refreshToken)
		mockRepo.AssertExpectations(t)
	})
}

func TestLogin_PasswordHashingError(t *testing.T) {
	setupTestEnv()
	mockRepo := new(MockUserRepository)
	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	// Create a test user with an invalid password hash (to trigger hash.Compare error)
	userId := uuid.New()
	user := []*entity.User{
		{
			Id:       userId,
			Username: "testuser",
			Password: "invalid_hash_format", // This should cause hash.Compare to fail
			Role:     "user",
		},
	}

	// Mock the Find method to return our test user
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(user, nil).Once()

	// Call the Login method
	request := &req.LoginRequest{
		Username: "testuser",
		Password: "password123",
	}

	accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

	// Assertions
	assert.Error(t, err)
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
	mockRepo.AssertExpectations(t)
}

func TestLogin_TokenGenerationError(t *testing.T) {
	// Setup environment with invalid JWT configuration
	os.Setenv("JWT_SECRET_ACCESS_KEY", "")    // Empty secret key should cause token generation to fail
	os.Setenv("JWT_ACCESS_EXPIRY", "invalid") // Invalid expiry time

	mockRepo := new(MockUserRepository)
	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	// Create a test user with a valid password
	testPassword := "password123"
	hashedPassword, _ := hash.Generate(testPassword)
	userId := uuid.New()

	user := []*entity.User{
		{
			Id:       userId,
			Username: "testuser",
			Password: hashedPassword,
			Role:     "user",
		},
	}

	// Mock the Find method to return our test user
	mockRepo.On("Find", ctx, mockDB, mock.Anything).Return(user, nil).Once()

	// Call the Login method
	request := &req.LoginRequest{
		Username: "testuser",
		Password: testPassword,
	}

	accessToken, refreshToken, err := authenUsecase.Login(ctx, request)

	// Assertions
	assert.Error(t, err)
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
	mockRepo.AssertExpectations(t)

	// Restore environment for other tests
	setupTestEnv()
}

func TestRegisterAccount(t *testing.T) {
	mockRepo := new(MockUserRepository)
	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

	ctx := context.Background()
	var mockDB *gorm.DB = nil

	// Test case: successful registration
	t.Run("Successful registration", func(t *testing.T) {
		// Create a registration request
		request := req.RegisterAccountRequest{
			Username: "newuser",
			Password: "password123",
			Mail:     "john.doe@example.com",
		}

		// Mock the Create method to simulate successful creation
		mockRepo.On("Create", ctx, mockDB, mock.MatchedBy(func(user *entity.User) bool {
			return user.Username == request.Username &&
				user.Mail == request.Mail &&
				user.Password != request.Password // Password should be hashed
		})).Return(nil).Once()

		// Call the RegisterAccount method
		err := authenUsecase.RegisterAccount(ctx, request)

		// Assertions
		assert.NoError(t, err)
		mockRepo.AssertExpectations(t)
	})

	// Test case: repository error during creation
	t.Run("Repository error during creation", func(t *testing.T) {
		expectedErr := errors.New("database error")

		// Create a registration request
		request := req.RegisterAccountRequest{
			Username: "newuser",
			Password: "password123",
			Mail:     "john.doe@example.com",
		}

		// Mock the Create method to simulate a database error
		mockRepo.On("Create", ctx, mockDB, mock.MatchedBy(func(user *entity.User) bool {
			return user.Username == request.Username
		})).Return(expectedErr).Once()

		// Call the RegisterAccount method
		err := authenUsecase.RegisterAccount(ctx, request)

		// Assertions
		assert.Error(t, err)
		assert.Equal(t, expectedErr, err)
		mockRepo.AssertExpectations(t)
	})
}

func TestRegisterAccount_EmptyFields(t *testing.T) {
	mockRepo := new(MockUserRepository)
	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

	ctx := context.Background()

	// Test empty username
	t.Run("Empty username", func(t *testing.T) {
		request := req.RegisterAccountRequest{
			Username: "", // Empty username
			Password: "password123",
			Mail:     "john.doe@example.com",
		}

		err := authenUsecase.RegisterAccount(ctx, request)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "username") // Error should mention username
	})

	// Test empty password
	t.Run("Empty password", func(t *testing.T) {
		request := req.RegisterAccountRequest{
			Username: "newuser",
			Password: "", // Empty password
			Mail:     "john.doe@example.com",
		}

		err := authenUsecase.RegisterAccount(ctx, request)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "password") // Error should mention password
	})

	// Test empty email
	t.Run("Empty email", func(t *testing.T) {
		request := req.RegisterAccountRequest{
			Username: "newuser",
			Password: "password123",
			Mail:     "", // Empty email
		}

		err := authenUsecase.RegisterAccount(ctx, request)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mail") // Error should mention mail
	})
}

func TestRegisterAccount_PasswordHashingError(t *testing.T) {
	// This test might be more difficult to implement depending on how your hash.Generate function works
	// If you have a way to mock the hash.Generate function or make it fail, implement it here

	// If you can't easily make hash.Generate fail, you might need to use a testing hook or dependency injection
	// For now, add a placeholder comment explaining why this test is challenging

	t.Skip("Skipping password hashing error test - requires ability to mock hash.Generate function")
}

// func TestFindByUsername(t *testing.T) {
// 	mockRepo := new(MockUserRepository)
// 	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

// 	ctx := context.Background()
// 	var mockDB *gorm.DB = nil

// 	// Test successful case
// 	t.Run("User found", func(t *testing.T) {
// 		userId := uuid.New()
// 		expectedUser := &entity.User{
// 			Id:       userId,
// 			Username: "testuser",
// 			Role:     "user",
// 		}

// 		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
// 			username, ok := condition["username"].(string)
// 			return ok && username == "testuser"
// 		})).Return([]*entity.User{expectedUser}, nil).Once()

// 		user, err := authenUsecase.FindByUsername(ctx, "testuser")

// 		assert.NoError(t, err)
// 		assert.Equal(t, expectedUser, user)
// 		mockRepo.AssertExpectations(t)
// 	})

// 	// Test user not found
// 	t.Run("User not found", func(t *testing.T) {
// 		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
// 			username, ok := condition["username"].(string)
// 			return ok && username == "nonexistent"
// 		})).Return([]*entity.User{}, nil).Once()

// 		user, err := authenUsecase.(ctx, "nonexistent")

// 		assert.Error(t, err)
// 		assert.Nil(t, user)
// 		assert.Equal(t, "user not found", err.Error())
// 		mockRepo.AssertExpectations(t)
// 	})

// 	// Test repository error
// 	t.Run("Repository error", func(t *testing.T) {
// 		expectedErr := errors.New("database error")
// 		mockRepo.On("Find", ctx, mockDB, mock.MatchedBy(func(condition map[string]interface{}) bool {
// 			username, ok := condition["username"].(string)
// 			return ok && username == "testuser"
// 		})).Return([]*entity.User{}, expectedErr).Once()

// 		user, err := authenUsecase.FindByUsername(ctx, "testuser")

// 		assert.Error(t, err)
// 		assert.Equal(t, expectedErr, err)
// 		assert.Nil(t, user)
// 		mockRepo.AssertExpectations(t)
// 	})
// }

// func TestRefreshToken(t *testing.T) {
// 	setupTestEnv()
// 	mockRepo := new(MockUserRepository)
// 	authenUsecase := usecase.NewAuthenUsecase(mockRepo)

// 	ctx := context.Background()

// 	// This test depends on your JWT implementation details
// 	// You'll need to create a valid refresh token and test the refresh functionality

// 	// Example using a pre-generated valid token (this is a placeholder)
// 	t.Run("Valid refresh token", func(t *testing.T) {
// 		// You might need to call your token generator directly to create a test token
// 		// This is just a placeholder - replace with actual token generation logic
// 		validRefreshToken := "valid.refresh.token"

// 		newAccessToken, newRefreshToken, err := authenUsecase.RefreshToken(ctx, validRefreshToken)

// 		// If your implementation is expected to validate this token, you'll need to generate a real one
// 		// For now, just check basic expectations
// 		if err == nil {
// 			assert.NotEmpty(t, newAccessToken)
// 			assert.NotEmpty(t, newRefreshToken)
// 		} else {
// 			// If this fails because you need a real token, you can skip or adjust the test
// 			t.Skip("Needs a valid refresh token for testing")
// 		}
// 	})

// 	t.Run("Invalid refresh token", func(t *testing.T) {
// 		invalidToken := "invalid.token"

// 		newAccessToken, newRefreshToken, err := authenUsecase.RefreshToken(ctx, invalidToken)

// 		assert.Error(t, err)
// 		assert.Empty(t, newAccessToken)
// 		assert.Empty(t, newRefreshToken)
// 	})
// }
