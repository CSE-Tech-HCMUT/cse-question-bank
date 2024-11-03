package req

import "cse-question-bank/internal/module/exam/model/entity"

type CreateExamRequest struct {
	TotalQuestion int          `json:"numberQuestion"`
	Subject        string       `json:"subject"`
	FilterConditions     []*FilterCondition `json:"filterTags"`
}

func (req CreateExamRequest) ToEntity() entity.Exam {
	filterConditionsList := make([]*entity.FilterCondition, 0)
	for _, filterCondition := range req.FilterConditions {
		tagAssignmentList := make([]*entity.TagAssignment, 0)
		for _, tagAssignment := range filterCondition.TagAssignments {
			tagAssignmentList = append(tagAssignmentList, &entity.TagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		filterConditionsList = append(filterConditionsList, &entity.FilterCondition{
			ExpectedCount: filterCondition.ExpectedCount,
			TagAssignments:  tagAssignmentList,
		})
	}

	return entity.Exam{
		TotalQuestion: req.TotalQuestion,
		Subject:        req.Subject,
		FilterConditions:     filterConditionsList,
	}
}
