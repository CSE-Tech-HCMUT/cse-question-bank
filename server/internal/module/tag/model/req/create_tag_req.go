package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type CreateTagRequest struct {
	Name        string                   `json:"name"`
	Description string                   `json:"description"`
	Options     []CreateTagOptionRequest `json:"options"`
	SubjectId   uuid.UUID                `json:"subjectId"`
}

type CreateTagOptionRequest struct {
	Name string `json:"name"`
}

func createOptoinTagReqToEntity(optionsReq []CreateTagOptionRequest) []entity.Option {
	optionsList := make([]entity.Option, 0)
	for _, optionReq := range optionsReq {
		option := entity.Option{
			Name: optionReq.Name,
		}
		optionsList = append(optionsList, option)
	}

	return optionsList
}

func CreateTagReqToEntity(tag CreateTagRequest) *entity.Tag {
	return &entity.Tag{
		Name:        tag.Name,
		Description: tag.Description,
		Options:     createOptoinTagReqToEntity(tag.Options),
		SubjectId:   tag.SubjectId,
	}
}
