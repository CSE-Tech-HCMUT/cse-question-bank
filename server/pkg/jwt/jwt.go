package jwt

import (
	"errors"
	"log/slog"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

type UserClaims struct {
	jwt.StandardClaims
	UserID uuid.UUID `json:"user_id"`
	Role   string    `json:"role"`
}

func GenerateToken(secret string, expiry int, userID uuid.UUID, role string) (string, error) {
	claims := UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(expiry) * time.Minute).Unix(),
		},
		UserID: userID,
		Role:   role,
	}

	// Use HMAC signing method (HS256)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret)) // Convert secret to []byte
	if err != nil {
		slog.Error("Generate token error", "error-message", err)
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string, secret string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&UserClaims{},
		func(t *jwt.Token) (interface{}, error) {
			// Ensure the signing method is HMAC (HS256)
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(secret), nil
		},
	)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
