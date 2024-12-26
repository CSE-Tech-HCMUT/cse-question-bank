package req

import (
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/tag_assignment/model/req"
	"cse-question-bank/internal/util"
	"encoding/json"

	"github.com/google/uuid"
)

// type EditAnswerRequest struct {
// 	Id      string          `json:"id"`
// 	Content json.RawMessage `json:"content" swaggertype:"array,object"`
// }

type EditQuestionRequest struct {
	Id        string          `json:"id" binding:"required"`
	Content   string          `json:"content"`
	Type      string          `json:"type"`
	Answer    json.RawMessage `json:"answer" swaggertype:"array,object"`
	SubjectId uuid.UUID       `json:"subjectId"`

	TagAssignmentsReq []req.UpdateTagAssignmentRequest `json:"tagAssignments"`
}

func EditReqToQuestionModel(req *EditQuestionRequest) *entity.Question {
	// var questionUUID uuid.UUID
	questionUUID, _ := util.ParseUUID(req.Id)

	var answer entity.Answer
	if req.Answer != nil {
		// answerUUID, _ := util.ParseUUID(req.Answer.Id)

		answer = entity.Answer{
			// Id:      answerUUID,
			Content: req.Answer,
		}
	}

	tagAssignments := make([]entity.TagAssignment, 0)
	for _, tagAssignmentReq := range req.TagAssignmentsReq {
		tagAssignment := entity.TagAssignment{
			Id:       tagAssignmentReq.Id,
			TagId:    tagAssignmentReq.TagId,
			OptionId: tagAssignmentReq.OptionId,
		}

		tagAssignments = append(tagAssignments, tagAssignment)
	}

	return &entity.Question{
		Id:             questionUUID,
		Content:        req.Content,
		Type:           entity.QuestionType(req.Type),
		Answer:         &answer,
		TagAssignments: tagAssignments,
		SubjectId:      &req.SubjectId,
	}
}
