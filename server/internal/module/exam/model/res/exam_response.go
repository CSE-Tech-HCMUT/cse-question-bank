package exam_res

import (
	"cse-question-bank/internal/module/question/model/res"

	"cse-question-bank/internal/module/exam/model/entity"

	qe "cse-question-bank/internal/module/question/model/entity"

	"github.com/google/uuid"
)

type ExamResponse struct {
	Id             uuid.UUID
	Questions      []*res.QuestionResponse
	NumberQuestion int
	Semester       string
	Subject        string
	FilterTags     []*FilterTag
}

type FilterTag struct {
	Id              int
	NumberQuestions int
	TagAssignments  []*TagAssignment
}

type TagAssignment struct {
	Id     int
	Tag    res.TagResponse
	Option res.OptionResponse
}

func EntityToResponse(exam *entity.Exam) *ExamResponse {
	return &ExamResponse{
		Id:             exam.Id,
		Questions:      convertQuestions(exam.Questions),
		NumberQuestion: exam.NumberQuestion,
		Semester:       exam.Semester,
		Subject:        exam.Subject,
		FilterTags:     convertFilterTags(exam.FilterTags),
	}
}

func convertQuestions(questions []*qe.Question) []*res.QuestionResponse {
	questionResponses := make([]*res.QuestionResponse, 0)
	for _, question := range questions {
		questionResponses = append(questionResponses, res.EntityToResponse(question, nil))
	}
	return questionResponses
}

func convertFilterTags(filterTags []*entity.FilterTag) []*FilterTag {
	filterTagResponses := make([]*FilterTag, 0)
	for _, filterTag := range filterTags {
		filterTagResponses = append(filterTagResponses, &FilterTag{
			Id:              filterTag.Id,
			NumberQuestions: filterTag.NumberQuestions,
			TagAssignments:  convertTagAssignments(filterTag.TagAssignments),
		})
	}
	return filterTagResponses
}

func convertTagAssignments(tagAssignments []*entity.TagAssignment) []*TagAssignment {
	tagAssignmentResponses := make([]*TagAssignment, 0)
	for _, tagAssignment := range tagAssignments {
		tagAssignmentResponses = append(tagAssignmentResponses, &TagAssignment{
			Id: tagAssignment.Id,
			Tag: res.TagResponse{
				Id:          tagAssignment.TagId,
				Name:        tagAssignment.Tag.Name,
				Description: tagAssignment.Tag.Description,
				Option: &res.OptionResponse{
					Id:   tagAssignment.OptionId,
					Name: tagAssignment.Option.Name,
				},
			},
			Option: res.OptionResponse{
				Id:   tagAssignment.OptionId,
				Name: tagAssignment.Option.Name,
			},
		})
	}
	return tagAssignmentResponses
}
