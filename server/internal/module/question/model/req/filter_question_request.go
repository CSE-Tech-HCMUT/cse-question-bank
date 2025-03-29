package req

import "github.com/google/uuid"

type FilterQuestionRequest struct {
	TagAssignments []*TagAssignment `json:"tagAssignments"`
	SubjectId      uuid.UUID        `json:"subjectId"`
}

type TagAssignment struct {
	TagId    int `json:"tagId"`
	OptionId int `json:"optionId"`
}
