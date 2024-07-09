package usecase

import (
	"os"

	"github.com/google/uuid"
)

func createFolder() (string, error) {
	folderName := uuid.New().String()
	folderPath := "./internal/module/latex_compiler/latex_source" + folderName
	err := os.Mkdir(folderPath, os.ModeAppend)
	if err != nil {
		return "", err
	}
	
	return folderPath, nil
}

func deleteFolder(folderPath string) error {
	err := os.Remove(folderPath)
	if err != nil {
		return err
	}

	return nil
}