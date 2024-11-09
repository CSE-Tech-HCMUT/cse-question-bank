package usecase

import (
	"context"
	"cse-question-bank/internal/module/latex_compiler/constant"
	"log/slog"

	"github.com/google/uuid"
)

// createfolder -> get folder name
// set output-directory to new folder
// call PdfLatexCompile with output.tex and args: output-directory, -interaction=batchmode
// open file to check then Readfile with os package
// delete folder
// return file
func (u *latexCompilerImpl) CompileQuestionLatex(ctx context.Context, questionId uuid.UUID) ([]byte, error) {
	folderPath, err := u.createFolder(questionSourcePath)
	if err != nil {
		slog.Error("Fail to create folder", "error-message", err)
		return nil, constant.ErrCreateFolder(err)
	}
	slog.Info("Create folder successfully", "folder-path", folderPath)
	defer deleteFolder(folderPath)

	questions, err := u.questionRepository.Find(ctx, nil, map[string]interface{}{
		"id": questionId,
	})
	question := questions[0]

	if err := u.createQuestionLatexFile(folderPath, question); err != nil {
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
