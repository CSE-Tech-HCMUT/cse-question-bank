package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type CreateExamRequest struct {
	TotalQuestion int       `json:"numberQuestion"`
	SubjectId     uuid.UUID `json:"subjectId"`
	// TODO: add filtercondition for exam to monitor
	FilterConditions []*FilterCondition `json:"filterConditions"`
	Code         int                `json:"code"`
	QuestionIdList   []string           `json:"questionIdList"`
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

	return entity.Exam{
		TotalQuestion:    req.TotalQuestion,
		SubjectId:        &req.SubjectId,
		FilterConditions: filterConditionsList,
		Questions:        questionList,
	}
}
