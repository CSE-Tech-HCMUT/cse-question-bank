package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type UpdateExamRequest struct {
	Id uuid.UUID
	TotalQuestion int          `json:"numberQuestion"`
	Subject        string       `json:"subject"`
	FilterConditions     []*FilterCondition `json:"filterTags"`
}

func (req UpdateExamRequest) ToEntity() *entity.Exam {
	filterConditionsList := make([]*entity.FilterCondition, 0)
	for _, filterCondition := range req.FilterConditions {
		tagAssignmentList := make([]*entity.FilterTagAssignment, 0)
		for _, tagAssignment := range filterCondition.TagAssignments {
			tagAssignmentList = append(tagAssignmentList, &entity.FilterTagAssignment{
				Id: tagAssignment.Id,
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		filterConditionsList = append(filterConditionsList, &entity.FilterCondition{
			Id: filterCondition.Id,
			ExpectedCount: filterCondition.ExpectedCount,
			FilterTagAssignments:  tagAssignmentList,
		})
	}

	return &entity.Exam{
		Id: req.Id,
		TotalQuestion: req.TotalQuestion,
		Subject:        req.Subject,
		FilterConditions:     filterConditionsList,
	}
}