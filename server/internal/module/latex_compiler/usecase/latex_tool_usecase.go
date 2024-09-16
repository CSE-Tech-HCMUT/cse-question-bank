package usecase

import (
	"cse-question-bank/internal/module/latex_compiler/constant"
	"cse-question-bank/internal/module/latex_compiler/model"
	"cse-question-bank/pkg/execute"
	"log/slog"
	"os"
	"time"
)

// createfolder -> get folder name
// set output-directory to new folder
// call PdfLatexCompile with output.tex and args: output-directory, -interaction=batchmode
// open file to check then Readfile with os package
// delete folder
// return file
func (u *latexCompilerImpl) LatexCompile(question *model.QuestionCompile) ([]byte, error) {
	folderPath, err := u.createFolder()
	if err != nil {
		slog.Error("Fail to create folder", "error-message", err)
		return nil, constant.ErrCreateFolder(err)
	}
	slog.Info("Create folder successfully", "folder-path", folderPath)
	defer deleteFolder(folderPath)

	if err := u.createOuputLatexFile(folderPath, question); err != nil {
		return nil, err
	}

	args := []string{
		"-output-directory=" + folderPath,
		"-interaction=batchmode",
		"-shell-escape",
	}
	err = pdfLatexCompile(folderPath + "/output.tex", args...)
	if err != nil {
		slog.Error("Fail to compile latex", "error-message", err)
		return nil, constant.ErrCompileLatex(err)
	}

	pdfFile, err := os.Open(folderPath + "/output.pdf")
	if err != nil {
		slog.Error("Fail to open file PDF result", "error-message", err)
		return nil, constant.ErrOpenFilePDF(err)
	}
	defer pdfFile.Close()

	pdfContent, err := os.ReadFile(folderPath + "/output.pdf")
	if err != nil {
		slog.Error("Fail to get file PDF content", "error-message", err)
		return nil, constant.ErrGetPDFContent(err)
	}

	return pdfContent, nil
}

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
