package req

import (
	"cse-question-bank/internal/module/question/model/entity"
	"cse-question-bank/internal/util"
	"encoding/json"

	"github.com/google/uuid"
)

type CreateAnswerRequest struct {
	Content json.RawMessage `json:"content" binding:"required"`
}

type CreateQuestionRequest struct {
	Content      string                   `json:"content" binding:"required"`
	Type         string                   `json:"type" binding:"required"`
	IsParent     bool                     `json:"is-parent"`
	ParentId     *string                  `json:"parent-id"`
	Tag          string                   `json:"tag" binding:"required"`
	Difficult    int                      `json:"difficult" binding:"required"`
	Answer       *CreateAnswerRequest     `json:"answer"`
}

func CreateReqToQuestionModel(req *CreateQuestionRequest) *entity.Question {
	// question := &entity.Question{
	// 	Content: req.Content,
	// 	IsParent: req.IsParent,
	// 	Type: entity.QuestionType(req.Type),
	// 	Tag: req.Tag,
	// 	Difficult: req.Difficult,
	// }

	// questions := make([]*entity.Question, 0)
	// questions = append(questions, question)

	// if question.IsParent {
	// 	for _, subQuestion := range req.SubQuestions {
	// 		answer := &entity.Answer{
	// 			Content: subQuestion.Answer.Content,
	// 		}

	// 		questions = append(questions, &entity.Question{
	// 			Content: subQuestion.Content,
	// 			IsParent: subQuestion.IsParent,
	// 			Type: entity.QuestionType(subQuestion.Type),
	// 			Tag: subQuestion.Tag,
	// 			Difficult: subQuestion.Difficult,
	// 			Answer: answer,
	// 		})
	// 	}
	// }
	var answer *entity.Answer
	if req.Answer != nil {
		answer = &entity.Answer{
			Content: req.Answer.Content,
		}
	}

	var parentUUID uuid.UUID
	if req.ParentId != nil {
		parentUUID, _ = util.ParseUUID(*req.ParentId)
	} else {
		parentUUID = uuid.Nil
	}

	return &entity.Question{
		Content:   req.Content,
		IsParent:  req.IsParent,
		ParentId:  &parentUUID,
		Type:      entity.QuestionType(req.Type),
		Tag:       req.Tag,
		Difficult: req.Difficult,
		Answer:    answer,
	}
}
