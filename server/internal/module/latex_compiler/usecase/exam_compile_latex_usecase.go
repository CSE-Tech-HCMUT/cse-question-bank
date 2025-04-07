package usecase

import (
	"context"
	"cse-question-bank/internal/module/latex_compiler/constant"
	"log/slog"

	"github.com/google/uuid"
)

func (u *latexCompilerImpl) CompileExamLatex(ctx context.Context, examId uuid.UUID) ([]byte, error) {
	folderPath, err := u.createFolder(examSourcePath)
	if err != nil {
		slog.Error("Fail to create folder", "error-message", err)
		return nil, constant.ErrCreateFolder(err)
	}
	slog.Info("Create folder successfully", "folder-path", folderPath)
	defer deleteFolder(folderPath)

	exams, err := u.examRepository.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if err != nil {
		slog.Error("fail to get exam in database", "error-message", err)
		return nil, err
	}
	exam := exams[0]

	if err := u.createExamLatexFile(folderPath, exam); err != nil {
		slog.Error("fail to create exam latex file", "error-message", err)
		return nil, err
	}

	args := []string{
		"-output-directory=" + folderPath,
		"-interaction=batchmode",
		"-shell-escape",
	}
	err = pdfLatexCompile(folderPath+"/output.tex", args...)
	if err != nil {
		slog.Error("Fail to compile latex", "error-message", err)
		return nil, constant.ErrCompileLatex(err)
	}

	pdfContent, err := u.getPDFContent(folderPath + "/output.pdf")
	if err != nil {
		return nil, err
	}

	return pdfContent, nil
}
