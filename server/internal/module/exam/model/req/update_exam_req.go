package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type UpdateExamRequest struct {
	Id               uuid.UUID
	TotalQuestion    int                `json:"numberQuestion"`
	SubjectId        uuid.UUID          `json:"subjectId"`
	FilterConditions []*FilterCondition `json:"filterConditions"`
	QuestionIdList []string `json:"questionIdList"`
}

func (req UpdateExamRequest) ToEntity() *entity.Exam {
	filterConditionsList := make([]*entity.FilterCondition, 0)
	for _, filterCondition := range req.FilterConditions {
		tagAssignmentList := make([]*entity.FilterTagAssignment, 0)
		for _, tagAssignment := range filterCondition.TagAssignments {
			tagAssignmentList = append(tagAssignmentList, &entity.FilterTagAssignment{
				Id:       tagAssignment.Id,
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		filterConditionsList = append(filterConditionsList, &entity.FilterCondition{
			Id:                   filterCondition.Id,
			ExpectedCount:        filterCondition.ExpectedCount,
			FilterTagAssignments: tagAssignmentList,
		})
	}

	questionList := make([]*entity.Question, 0)
	for _, questionId := range req.QuestionIdList {
		questionUUID, err := uuid.Parse(questionId)
		if err != nil {
			continue
		}
		questionList = append(questionList, &entity.Question{
			Id: questionUUID,
		})
	}

	return &entity.Exam{
		Id:               req.Id,
		TotalQuestion:    req.TotalQuestion,
		SubjectId:        &req.SubjectId,
		FilterConditions: filterConditionsList,
		Questions: questionList,
	}
}
