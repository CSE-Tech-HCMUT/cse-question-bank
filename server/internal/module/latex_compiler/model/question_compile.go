package model

import "encoding/json"

type QuestionCompile struct {
	Content      string             `json:"content"`
	IsParent     bool               `json:"is-parent"`
	SubQuestions []*QuestionCompile `json:"sub-questions"`
	Answer       json.RawMessage    `json:"answer"`
}
