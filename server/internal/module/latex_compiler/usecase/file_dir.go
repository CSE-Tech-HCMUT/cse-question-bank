package usecase

import (
	"cse-question-bank/internal/module/latex_compiler/model"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"strings"

	"github.com/google/uuid"
)

const path string = "./internal/module/latex_compiler/latex_source/"

func (u *latexCompilerImpl) createFolder() (string, error) {
	folderName := uuid.New().String()
	folderPath := path + folderName
	err := os.Mkdir(folderPath, os.ModeAppend)
	if err != nil {
		return "", err
	}

	return folderPath, nil
}

func (u *latexCompilerImpl) createOuputLatexFile(folderPath string, question *model.QuestionCompile) error {
	packageFile, err := os.ReadFile(path + "package.tex")
	if err != nil {
		return err
	}
	packageContent := string(packageFile)

	contentTemplateFile, err := os.ReadFile(path + "content_template.tex")
	if err != nil {
		return err
	}

	contentTemplate := string(contentTemplateFile)

	questionContent, err := u.GenerateQuestionContent(question)
	if err != nil {
		return err
	}

	contentTemplate = strings.Replace(contentTemplate, "<<QUESTION_CONTENT>>", questionContent, -1)

	finalContent := packageContent + "\n" + contentTemplate

	// Tên file .tex
	fileName := folderPath + "/output.tex"
	print(fileName)
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

func deleteFolder(folderPath string) error {
	err := os.RemoveAll(folderPath)
	if err != nil {
		return err
	}

	return nil
}

type MultipleChoiceAnswer struct {
	Content   string
	IsCorrect bool `json:"is-correct"`
}

func (u *latexCompilerImpl) GenerateQuestionContent(question *model.QuestionCompile) (string, error) {
	var result string
	if question.IsParent {
		subQuestionsCount := len(question.SubQuestions)

		result = fmt.Sprintf("\\begin{block}[questions=%d]\nĐoạn mô tả sau được áp dụng cho các câu \\thefirst-\\thelast.\n\n%s", subQuestionsCount, question.Content)
		for _, subQuestion := range question.SubQuestions {
			subQuestionContent, err := u.GenerateQuestionContent(subQuestion)
			if err != nil {
				return "", err
			}
			result += subQuestionContent + "\n"
		}

		result += "\\end{block}"
	} else {
		result = "\\begin{question}\n" + question.Content + "\n"

		answerContent, err := u.GenerateAnswerContent(question.Answer)
		if err != nil {
			return "", err
		}
		result += answerContent + "\n\\end{question}"
	}

	return result, nil
}

func (u *latexCompilerImpl) GenerateAnswerContent(answerContent json.RawMessage) (string, error) {
	var answers []MultipleChoiceAnswer

	err := json.Unmarshal(answerContent, &answers)
	if err != nil {
		return "", err
	}

	result := "\\datcot\n\\bonpa\n"

	for _, answer := range answers {
		var correctString string
		if answer.IsCorrect {
			correctString = "dung"
		} else {
			correctString = "sai"
		}
		result += fmt.Sprintf("{\\%s{%s}}\n", correctString, answer.Content)
	}

	return result, nil
}
