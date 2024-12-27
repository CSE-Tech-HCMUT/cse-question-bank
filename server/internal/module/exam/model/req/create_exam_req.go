package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type CreateExamRequest struct {
	TotalQuestion    int                `json:"numberQuestion"`
	SubjectId        uuid.UUID          `json:"subjectId"`
	FilterConditions []*FilterCondition `json:"filterTags"`
}

func (req CreateExamRequest) ToEntity() entity.Exam {
	filterConditionsList := make([]*entity.FilterCondition, 0)
	for _, filterCondition := range req.FilterConditions {
		tagAssignmentList := make([]*entity.FilterTagAssignment, 0)
		for _, tagAssignment := range filterCondition.TagAssignments {
			tagAssignmentList = append(tagAssignmentList, &entity.FilterTagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		filterConditionsList = append(filterConditionsList, &entity.FilterCondition{
			ExpectedCount:        filterCondition.ExpectedCount,
			FilterTagAssignments: tagAssignmentList,
		})
	}

	return entity.Exam{
		TotalQuestion:    req.TotalQuestion,
		SubjectId:        &req.SubjectId,
		FilterConditions: filterConditionsList,
	}
}
