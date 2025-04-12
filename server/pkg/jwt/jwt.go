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
	slog.Info("Verifying token", "token", tokenString)

	token, err := jwt.ParseWithClaims(
		tokenString,
		&UserClaims{},
		func(t *jwt.Token) (interface{}, error) {
			// Ensure the signing method is HMAC (HS256)
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				slog.Error("Unexpected signing method", "method", t.Method.Alg())
				return nil, errors.New("unexpected signing method")
			}
			slog.Info("Signing method verified", "method", t.Method.Alg())
			return []byte(secret), nil
		},
	)
	if err != nil {
		slog.Error("Error parsing token", "error", err)
		return nil, err
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok || !token.Valid {
		slog.Error("Invalid token or claims", "valid", token.Valid)
		return nil, ErrInvalidToken
	}

	slog.Info("Token verified successfully", "user_id", claims.UserID, "role", claims.Role)
	return claims, nil
}
