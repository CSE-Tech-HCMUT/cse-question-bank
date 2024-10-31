package req

import "cse-question-bank/internal/module/exam/model/entity"

type CreateExamRequest struct {
	NumberQuestion int          `json:"numberQuestion"`
	Subject        string       `json:"subject"`
	FilterTags     []*FilterTag `json:"filterTags"`
}

func (req CreateExamRequest) ToEntity() entity.Exam {
	filterTagList := make([]*entity.FilterTag, 0)
	for _, filterTag := range req.FilterTags {
		tagAssignmentList := make([]*entity.TagAssignment, 0)
		for _, tagAssignment := range filterTag.TagAssignments {
			tagAssignmentList = append(tagAssignmentList, &entity.TagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		filterTagList = append(filterTagList, &entity.FilterTag{
			NumberQuestions: filterTag.NumberQuestion,
			TagAssignments:  tagAssignmentList,
		})
	}

	return entity.Exam{
		NumberQuestion: req.NumberQuestion,
		Subject:        req.Subject,
		FilterTags:     filterTagList,
	}
}
