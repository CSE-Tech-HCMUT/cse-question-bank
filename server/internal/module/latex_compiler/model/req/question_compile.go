package req

import "encoding/json"

type QuestionCompileRequest struct {
	Content      string             `json:"content"`
	IsParent     bool               `json:"isParent"`
	SubQuestions []*QuestionCompileRequest `json:"subQuestions" swaggertype:"array,object"`
	Answer       json.RawMessage    `json:"answer" swaggertype:"object"`
}
