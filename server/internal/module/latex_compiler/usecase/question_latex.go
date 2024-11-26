package usecase

import (
	"cse-question-bank/internal/module/question/model/entity"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"strings"
)

const questionSourcePath string = "./internal/module/latex_compiler/latex_source/question/"

func (u *latexCompilerImpl) createQuestionLatexFile(folderPath string, question *entity.Question) error {
	packageFile, err := os.ReadFile(questionSourcePath + "package.tex")
	if err != nil {
		return err
	}
	packageContent := string(packageFile)

	contentTemplateFile, err := os.ReadFile(questionSourcePath + "content_template.tex")
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
	IsCorrect bool
}

func (u *latexCompilerImpl) GenerateQuestionContent(question *entity.Question) (string, error) {
	result := "\\begin{vnmultiplechoice}\n"

	if question.IsParent {
		subQuestions, err := u.questionRepository.Find(nil, nil, map[string]interface{}{
			"parent_id": question.Id,
		})

		if err != nil {
			return "", err
		}
		subQuestionsCount := len(subQuestions)

		result += fmt.Sprintf("\\begin{block}[questions=%d]\nĐoạn mô tả sau được áp dụng cho các câu \\thefirst-\\thelast.\n\n%s", subQuestionsCount, question.Content)
		for _, subQuestion := range subQuestions {

			subQuestionContent, err := u.GenerateQuestionContent(subQuestion)
			if err != nil {
				return "", err
			}
			print("3")
			result += subQuestionContent + "\n"
		}

		result += "\\end{block}"
	} else {
		result += "\\begin{question}\n" + question.Content + "\n"
		print(question.Answer.Content)
		print(123)
		answerContent, err := u.GenerateAnswerContent(question.Answer.Content)
		if err != nil {
			return "", err
		}
		result += answerContent + "\n\\end{question}\n"
	}
	result += "\\end{vnmultiplechoice}\n"
	return result, nil
}

func (u *latexCompilerImpl) GenerateAnswerContent(answerContent json.RawMessage) (string, error) {
	print("12")
	var answers []MultipleChoiceAnswer
	print("!@3")
	err := json.Unmarshal(answerContent, &answers)
	print("123321")
	if err != nil {
		return "", err
	}

	result := "\\datcot\n\\bonpa"

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