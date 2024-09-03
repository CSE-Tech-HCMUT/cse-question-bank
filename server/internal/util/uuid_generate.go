package util

import "github.com/google/uuid"

func GenerateUUID() (uuid.UUID, error) {
	newUUID, err := uuid.NewRandom() 	
	if err != nil {
		return uuid.Nil, err
	}

	return newUUID, nil
}