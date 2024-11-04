package usecase

import (
	"cse-question-bank/internal/module/exam/model/entity"
	"log/slog"
	"os"
	"strings"
)

const examSourcePath = "./internal/module/latex_compiler/latex_source/exam/"

func (u *latexCompilerImpl) createExamLatexFile(folderPath string, exam *entity.Exam) error {
	packageFile, err := os.ReadFile(examSourcePath + "package.tex")
	if err != nil {
		return err
	}
	packageContent := string(packageFile)

	contentTemplateFile, err := os.ReadFile(examSourcePath + "content_template.tex")
	if err != nil {
		return err
	}

	contentTemplate := string(contentTemplateFile)

	examContent, err := u.generateExamContent(exam)
	if err != nil {
		return err
	}

	contentTemplate = strings.Replace(contentTemplate, "<<EXAM_CONTENT>>", examContent, -1)

	finalContent := packageContent + "\n" + contentTemplate

	// Tên file .tex
	fileName := folderPath + "/output.tex"
	// Tạo và mở file .tex
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			slog.Error("Can not close file", "error-message", err)
		}
	}(file)

	// Ghi nội dung vào file .tex
	_, err = file.WriteString(finalContent)
	if err != nil {
		return err
	}
	return nil
}

func (u *latexCompilerImpl) generateExamContent(exam *entity.Exam) (string, error) {
	examContent := ""

	for _, filterCondition := range exam.FilterConditions {
		for _, question := range filterCondition.Questions {
			questionContent, err := u.GenerateQuestionContent(question)
			if err != nil {
				return "", err
			}

			examContent += questionContent
		}
	}

	return examContent, nil
}
