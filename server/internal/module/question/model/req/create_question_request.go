package req

import (
	qe "cse-question-bank/internal/module/question/model/entity"
	tae "cse-question-bank/internal/module/tag_assignment/model/entity"
	"cse-question-bank/internal/module/tag_assignment/model/req"
	"cse-question-bank/internal/util"
	"encoding/json"

	"github.com/google/uuid"
)

type CreateQuestionRequest struct {
	Content   string          `json:"content" binding:"required"`
	Type      string          `json:"type" binding:"required"`
	IsParent  bool            `json:"isParent"`
	ParentId  *string         `json:"parentId"`
	Answer    json.RawMessage `json:"answer"`

	TagAssignmentsReq []*req.CreateTagAssignmentRequest `json:"tagAssignments"`
}

func CreateReqToQuestionModel(req *CreateQuestionRequest) *qe.Question {
	var answer *qe.Answer
	if req.Answer != nil {
		answer = &qe.Answer{
			Content: req.Answer,
		}
	}

	var parentUUID uuid.UUID
	if req.ParentId != nil {
		parentUUID, _ = util.ParseUUID(*req.ParentId)
	} else {
		parentUUID = uuid.Nil
	}

	tagAssignments := make([]tae.TagAssignment, 0)
	for _, tagAssignmentReq := range req.TagAssignmentsReq {
		tagAssignment := tae.TagAssignment{
			TagId:    tagAssignmentReq.TagId,
			OptionId: tagAssignmentReq.OptionId,
		}

		tagAssignments = append(tagAssignments, tagAssignment)
	}

	return &qe.Question{
		Content:        req.Content,
		IsParent:       req.IsParent,
		ParentId:       &parentUUID,
		Type:           qe.QuestionType(req.Type),
		Answer:         answer,
		TagAssignments: tagAssignments,
	}
}
