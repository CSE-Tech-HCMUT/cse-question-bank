package model

import "encoding/json"

type QuestionCompile struct {
	Content      string             `json:"content"`
	IsParent     bool               `json:"isParent"`
	SubQuestions []*QuestionCompile `json:"subQuestions"`
	Answer       json.RawMessage    `json:"answer"`
}
