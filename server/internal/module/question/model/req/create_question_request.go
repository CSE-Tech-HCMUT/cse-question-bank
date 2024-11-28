package req

import (
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/tag_assignment/model/req"
	"cse-question-bank/internal/util"
	"encoding/json"

	"github.com/google/uuid"
)

type CreateQuestionRequest struct {
	Content  string          `json:"content" binding:"required"`
	Type     string          `json:"type" binding:"required"`
	IsParent bool            `json:"isParent"`
	ParentId *string         `json:"parentId"`
	Answer   json.RawMessage `json:"answer" swaggertype:"object"`

	TagAssignmentsReq []*req.CreateTagAssignmentRequest `json:"tagAssignments"`
}

func CreateReqToQuestionModel(req *CreateQuestionRequest) *entity.Question {
	var answer *entity.Answer
	if req.Answer != nil {
		answer = &entity.Answer{
			Content: req.Answer,
		}
	}

	var parentUUID uuid.UUID
	if req.ParentId != nil {
		parentUUID, _ = util.ParseUUID(*req.ParentId)
	} else {
		parentUUID = uuid.Nil
	}

	tagAssignments := make([]entity.TagAssignment, 0)
	for _, tagAssignmentReq := range req.TagAssignmentsReq {
		tagAssignment := entity.TagAssignment{
			TagId:    tagAssignmentReq.TagId,
			OptionId: tagAssignmentReq.OptionId,
		}

		tagAssignments = append(tagAssignments, tagAssignment)
	}

	return &entity.Question{
		Content:        req.Content,
		IsParent:       req.IsParent,
		ParentId:       &parentUUID,
		Type:           entity.QuestionType(req.Type),
		Answer:         answer,
		TagAssignments: tagAssignments,
	}
}
