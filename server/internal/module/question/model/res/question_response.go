package res

import (
	"cse-question-bank/internal/module/question/model/entity"
	"encoding/json"
)

type QuestionResponse struct {
	Id       string              `json:"id"`
	Content  string              `json:"content"`
	Type     string              `json:"type"`
	Question []*QuestionResponse `json:"subQuestions" swaggertype:"object"`
	Answer   *AnswerResponse     `json:"answer"`
	TagAssignments     []*TagAssignmentResponse      `json:"tagAssignments"`
}

type AnswerResponse struct {
	Id      string          `json:"id"`
	Content json.RawMessage `json:"content" swaggertype:"object"`
}

type TagAssignmentResponse struct {
	Id int
	Tag *TagResponse
	Option *OptionResponse
}

type TagResponse struct {
	Id          int             `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
}

type OptionResponse struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func EntityToResponse(question *entity.Question, childQuestion []*QuestionResponse) *QuestionResponse {
	var answer *AnswerResponse
	if question.Answer != nil {
		answer = &AnswerResponse{
			Id:      question.Answer.Id.String(),
			Content: question.Answer.Content,
		}
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
			Id: tagAssignment.Id,
			Tag: tagRes,
			Option: optionRes,
		})
	}

	return &QuestionResponse{
		Id:       question.Id.String(),
		Content:  question.Content,
		Type:     string(question.Type),
		Answer:   answer,
		Question: childQuestion,
		TagAssignments: tagsAssginmentsList,
	}
}
