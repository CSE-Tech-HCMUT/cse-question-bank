package usecase

import (
	"context"
	"cse-question-bank/internal/module/authen/model/req"
	"cse-question-bank/pkg/hash"
	"cse-question-bank/pkg/jwt"
	"errors"
	"log/slog"
	"os"
	"strconv"

	"github.com/google/uuid"
)

func (u *authenUsecaseImpl) Login(ctx context.Context, request *req.LoginRequest) (string, string, error) {

	userAccount, err := u.userRepository.Find(ctx, nil, map[string]interface{}{
		"username": request.Username,
	})

	if err != nil {
		slog.Error("Login error", "error-message", err)
		return "", "", err
	}

	if len(userAccount) == 0 {
		slog.Error("Login error", "error-message", "no account")
		return "", "", errors.New("no account")
	}

	if ok := hash.Validate(userAccount[0].Password, request.Password); !ok {
		slog.Error("Login error", "error-message", "password not match")
		return "", "", errors.New("try again")
	}

	accessToken, err := generateAccessToken(userAccount[0].Id, string(userAccount[0].Role))
	if err != nil {
		slog.Error("Login error", "error-message", err)
		return "", "", err
	}

	refreshToken, err := generateRefreshToken(userAccount[0].Id)
	if err != nil {
		slog.Error("Login error", "error-message", err)
		return "", "", err
	}
	return accessToken, refreshToken, nil
}

func generateAccessToken(id uuid.UUID, role string) (string, error) {
	accessSecretKey := os.Getenv("JWT_SECRET_ACCESS_KEY")
	if accessSecretKey == "" {
		slog.Error("Login error", "error-message", "cant not generate key")
		return "", errors.New("cant not generate key")
	}

	accessExpiry, err := strconv.Atoi(os.Getenv("JWT_ACCESS_EXPIRY"))
	if err != nil {
		slog.Error("Login error", "error-message", err)
		return "", err
	}

	accessToken, err := jwt.GenerateToken(accessSecretKey, accessExpiry, id, role)
	if err != nil {
		slog.Error("Generate access token", "error-message", err)
		return "", err
	}

	return accessToken, nil
}

func generateRefreshToken(id uuid.UUID) (string, error) {
	refreshSecretKey := os.Getenv("JWT_SECRET_REFRESH_KEY")
	if refreshSecretKey == "" {
		return "", errors.New("cant not generate key")
	}

	refreshExpiry, err := strconv.Atoi(os.Getenv("JWT_REFRESH_EXPIRY"))
	if err != nil {
		return "", err
	}

	refreshToken, err := jwt.GenerateToken(refreshSecretKey, refreshExpiry, id, "")
	if err != nil {
		return "", err
	}

	return refreshToken, nil
}
