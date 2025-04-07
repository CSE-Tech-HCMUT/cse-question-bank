package question_res

import (
	"cse-question-bank/internal/database/entity"
	"encoding/json"

	"github.com/google/uuid"
)

type QuestionResponse struct {
	Id             string                   `json:"id"`
	Content        string                   `json:"content"`
	Type           string                   `json:"type"`
	Question       []*QuestionResponse      `json:"subQuestions" swaggertype:"array,object"`
	Answer         json.RawMessage          `json:"answer" swaggertype:"array,object"`
	TagAssignments []*TagAssignmentResponse `json:"tagAssignments"`
	Subject        SubjectResponse          `json:"subject"`
	CanShuffle     bool                     `json:"canShuffle"`
}

type SubjectResponse struct {
	Id   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Code string    `json:"code"`
}

type TagAssignmentResponse struct {
	Id     int             `json:"id"`
	Tag    *TagResponse    `json:"tag"`
	Option *OptionResponse `json:"option"`
}

type TagResponse struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type OptionResponse struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func EntityToResponse(question *entity.Question, childQuestion []*QuestionResponse) *QuestionResponse {
	// var answer *AnswerResponse
	var answer json.RawMessage
	if question.Answer != nil {
		answer = question.Answer.Content

	}

	tagsAssginmentsList := make([]*TagAssignmentResponse, 0)
	for _, tagAssignment := range question.TagAssignments {
		optionRes := &OptionResponse{
			Id:   tagAssignment.OptionId,
			Name: tagAssignment.Option.Name,
		}

		tagRes := &TagResponse{
			Id:          tagAssignment.TagId,
			Name:        tagAssignment.Tag.Name,
			Description: tagAssignment.Tag.Description,
		}

		tagsAssginmentsList = append(tagsAssginmentsList, &TagAssignmentResponse{
			Id:     tagAssignment.Id,
			Tag:    tagRes,
			Option: optionRes,
		})
	}

	return &QuestionResponse{
		Id:             question.Id.String(),
		Content:        question.Content,
		Type:           string(question.Type),
		Answer:         answer,
		Question:       childQuestion,
		TagAssignments: tagsAssginmentsList,
		Subject: SubjectResponse{
			Id:   question.Subject.Id,
			Name: question.Subject.Name,
			Code: question.Subject.Code,
		},
		CanShuffle: question.CanShuffle,
	}
}
