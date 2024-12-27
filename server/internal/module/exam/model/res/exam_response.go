package exam_res

import (
	"cse-question-bank/internal/database/entity"
	question_res "cse-question-bank/internal/module/question/model/res"
	tag_res "cse-question-bank/internal/module/tag/model/res"
	option_res "cse-question-bank/internal/module/tag_option/model/res"

	"github.com/google/uuid"
)

type ExamResponse struct {
	Id uuid.UUID `json:"id"`
	// Questions        []*question_res.QuestionResponse `json:"questions"`
	TotalQuestion    int                `json:"totalQuestion"`
	Semester         string             `json:"semester"`
	Subject          SubjectResponse    `json:"subject"`
	FilterConditions []*FilterCondition `json:"filterConditions"`
}

type SubjectResponse struct {
	Id   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Code string    `json:"code"`
}

type FilterCondition struct {
	Id             int                              `json:"id"`
	ExpectedCount  int                              `json:"expectCount"`
	TagAssignments []*TagAssignment                 `json:"tagAssignments"`
	Questions      []*question_res.QuestionResponse `json:"questions"`
}

type TagAssignment struct {
	Id     int                       `json:"id"`
	Tag    tag_res.TagResponse       `json:"tag"`
	Option option_res.OptionResponse `json:"option"`
}

func EntityToResponse(exam *entity.Exam) *ExamResponse {
	return &ExamResponse{
		Id:            exam.Id,
		TotalQuestion: exam.TotalQuestion,
		Semester:      exam.Semester,
		Subject: SubjectResponse{
			Id:   exam.Subject.Id,
			Name: exam.Subject.Name,
			Code: exam.Subject.Code,
		},
		FilterConditions: convertFilterTags(exam.FilterConditions),
	}
}

func convertQuestions(questions []*entity.Question) []*question_res.QuestionResponse {
	questionResponses := make([]*question_res.QuestionResponse, 0)
	for _, question := range questions {
		questionResponses = append(questionResponses, question_res.EntityToResponse(question, nil))
	}
	return questionResponses
}

func convertFilterTags(filterConditions []*entity.FilterCondition) []*FilterCondition {
	filterConditionListRes := make([]*FilterCondition, 0)
	for _, filterCondition := range filterConditions {
		filterConditionListRes = append(filterConditionListRes, &FilterCondition{
			Id:             filterCondition.Id,
			ExpectedCount:  filterCondition.ExpectedCount,
			TagAssignments: convertTagAssignments(filterCondition.FilterTagAssignments),
			Questions:      convertQuestions(filterCondition.Questions),
		})
	}
	return filterConditionListRes
}

func convertTagAssignments(tagAssignments []*entity.FilterTagAssignment) []*TagAssignment {
	tagAssignmentResponses := make([]*TagAssignment, 0)
	for _, tagAssignment := range tagAssignments {
		tagAssignmentResponses = append(tagAssignmentResponses, &TagAssignment{
			Id: tagAssignment.Id,
			Tag: tag_res.TagResponse{
				Id:          tagAssignment.TagId,
				Name:        tagAssignment.Tag.Name,
				Description: tagAssignment.Tag.Description,
			},
			Option: option_res.OptionResponse{
				Id:   tagAssignment.OptionId,
				Name: tagAssignment.Option.Name,
			},
		})
	}
	return tagAssignmentResponses
}
