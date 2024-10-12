package req

import (
	qe "cse-question-bank/internal/module/question/model/entity"
	tae "cse-question-bank/internal/module/tag_assignment/model/entity"
	"cse-question-bank/internal/module/tag_assignment/model/req"
	"cse-question-bank/internal/util"
	"encoding/json"
)

type EditAnswerRequest struct {
	Id      string          `json:"id"`
	Content json.RawMessage `json:"content"`
}

type EditQuestionRequest struct {
	Id      string             `json:"id"`
	Content string             `json:"content"`
	Type    string             `json:"type"`
	Answer  *EditAnswerRequest `json:"answer"`

	TagAssignmentsReq []req.UpdateTagAssignmentRequest `json:"tagAssignments"`
}

func EditReqToQuestionModel(req *EditQuestionRequest) *qe.Question {
	// var questionUUID uuid.UUID
	questionUUID, _ := util.ParseUUID(req.Id)

	var answer qe.Answer
	if req.Answer != nil {
		answerUUID, _ := util.ParseUUID(req.Answer.Id)

		answer = qe.Answer{
			Id:      answerUUID,
			Content: req.Answer.Content,
		}
	}

	tagAssignments := make([]tae.TagAssignment, 0)
	for _, tagAssignmentReq := range req.TagAssignmentsReq {
		tagAssignment := tae.TagAssignment{
			Id:       tagAssignmentReq.Id,
			TagId:    tagAssignmentReq.TagId,
			OptionId: tagAssignmentReq.OptionId,
		}

		tagAssignments = append(tagAssignments, tagAssignment)
	}

	return &qe.Question{
		Id:             questionUUID,
		Content:        req.Content,
		Type:           qe.QuestionType(req.Type),
		Answer:         &answer,
		TagAssignments: tagAssignments,
	}
}
