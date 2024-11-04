package usecase

import (
	"cse-question-bank/internal/module/latex_compiler/constant"
	"cse-question-bank/pkg/execute"
	"log/slog"
	"os"
	"time"

	"github.com/google/uuid"
)

func pdfLatexCompile(filename string, args ...string) error {
	return latextool("pdflatex", filename, args...)
}

func latextool(toolname string, filename string, args ...string) error {
	execute := execute.NewExecutor(10 * time.Second)
	args = append(args, filename)

	err := execute.RunCommand(toolname, args...)
	if err != nil {
		return err
	}

	return nil
}

func (u *latexCompilerImpl) createFolder(sourcePath string) (string, error) {
	folderName := uuid.New().String()
	folderPath := sourcePath + folderName
	err := os.Mkdir(folderPath, os.ModeAppend)
	if err != nil {
		return "", err
	}

	return folderPath, nil
}

func (u *latexCompilerImpl) getPDFContent(filePath string) ([]byte, error) {
	pdfFile, err := os.Open(filePath)
	if err != nil {
		slog.Error("Fail to open file PDF result", "error-message", err)
		return nil, constant.ErrOpenFilePDF(err)
	}
	defer pdfFile.Close()

	pdfContent, err := os.ReadFile(filePath)
	if err != nil {
		slog.Error("Fail to get file PDF content", "error-message", err)
		return nil, constant.ErrGetPDFContent(err)
	}

	return pdfContent, nil
}
