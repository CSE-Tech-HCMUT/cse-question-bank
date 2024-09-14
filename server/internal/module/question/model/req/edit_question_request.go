package req

import (
	"cse-question-bank/internal/module/question/model/entity"
	"cse-question-bank/internal/util"
	"encoding/json"
)

type EditAnswerRequest struct {
	Id      string          `json:"id"`
	Content json.RawMessage `json:"content"`
}

type EditQuestionRequest struct {
	Id        string             `json:"id"`
	Content   string             `json:"content"`
	Type      string             `json:"type"`
	Tag       string             `json:"tag"`
	Difficult int                `json:"difficult"`
	Answer    *EditAnswerRequest `json:"answer"`
}

func EditReqToQuestionModel(req *EditQuestionRequest) *entity.Question {
	// var questionUUID uuid.UUID
	questionUUID, _ := util.ParseUUID(req.Id)

	var answer entity.Answer
	if req.Answer != nil {
		answerUUID, _ := util.ParseUUID(req.Answer.Id)

		answer = entity.Answer{
			Id:      answerUUID,
			Content: req.Answer.Content,
		}
	}

	return &entity.Question{
		Id:        questionUUID,
		Content:   req.Content,
		Type:      entity.QuestionType(req.Type),
		Tag:       req.Tag,
		Difficult: req.Difficult,
		Answer:    &answer,
	}
}
