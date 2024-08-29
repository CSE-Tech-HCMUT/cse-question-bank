package model

import "encoding/json"

type JSON json.RawMessage

type Answer struct {
	Id         string
	Content    JSON
	QuestionId string
}
