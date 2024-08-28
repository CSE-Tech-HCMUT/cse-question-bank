package jwt

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

type UserClaims struct {
	jwt.StandardClaims
	UserID string
	Role   string
}

func Generate(userID, role string) (string, error) {
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	tokenDuration, _ := strconv.Atoi((os.Getenv("TOKEN_DURATION")))
	
	claims := UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(tokenDuration)).Unix(),
		},
		UserID: userID,
		Role:   role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func Verify(accessToken string) (*UserClaims, error) {
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")

	token, err := jwt.ParseWithClaims(
		accessToken,
		&UserClaims{},
		func(t *jwt.Token) (interface{}, error) {
			return []byte(jwtSecretKey), nil
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
