package exam_res

import (
	"cse-question-bank/internal/module/question/model/res"

	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type ExamResponse struct {
	Id               uuid.UUID
	Questions        []*res.QuestionResponse
	TotalQuestion    int
	Semester         string
	Subject          string
	FilterConditions []*FilterCondition
}

type FilterCondition struct {
	Id             int
	ExpectedCount  int
	TagAssignments []*TagAssignment
	Questions      []*res.QuestionResponse
}

type TagAssignment struct {
	Id     int
	Tag    res.TagResponse
	Option res.OptionResponse
}

func EntityToResponse(exam *entity.Exam) *ExamResponse {
	return &ExamResponse{
		Id:               exam.Id,
		TotalQuestion:    exam.TotalQuestion,
		Semester:         exam.Semester,
		Subject:          exam.Subject,
		FilterConditions: convertFilterTags(exam.FilterConditions),
	}
}

func convertQuestions(questions []*entity.Question) []*res.QuestionResponse {
	questionResponses := make([]*res.QuestionResponse, 0)
	for _, question := range questions {
		questionResponses = append(questionResponses, res.EntityToResponse(question, nil))
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
			Tag: res.TagResponse{
				Id:          tagAssignment.TagId,
				Name:        tagAssignment.Tag.Name,
				Description: tagAssignment.Tag.Description,
			},
			Option: res.OptionResponse{
				Id:   tagAssignment.OptionId,
				Name: tagAssignment.Option.Name,
			},
		})
	}
	return tagAssignmentResponses
}
