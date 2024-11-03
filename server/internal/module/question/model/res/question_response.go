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
	Tags     []*TagResponse      `json:"tags"`
}

type AnswerResponse struct {
	Id      string          `json:"id"`
	Content json.RawMessage `json:"content" swaggertype:"object"`
}

type TagResponse struct {
	Id          int             `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Option      *OptionResponse `json:"option"`
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

	tagsListRes := make([]*TagResponse, 0)
	for _, tagAssignment := range question.TagAssignments {
		optionRes := &OptionResponse{
			Id:   tagAssignment.OptionId,
			Name: tagAssignment.Option.Name,
		}

		tagRes := &TagResponse{
			Id:          tagAssignment.TagId,
			Name:        tagAssignment.Tag.Name,
			Description: tagAssignment.Tag.Description,
			Option:      optionRes,
		}

		tagsListRes = append(tagsListRes, tagRes)
	}

	return &QuestionResponse{
		Id:       question.Id.String(),
		Content:  question.Content,
		Type:     string(question.Type),
		Answer:   answer,
		Question: childQuestion,
		Tags:     tagsListRes,
	}
}
