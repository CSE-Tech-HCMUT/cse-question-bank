package req

import (
	tag_entity "cse-question-bank/internal/module/tag/model/entity"
	"cse-question-bank/internal/module/tag_option/model/entity"
)

type CreateTagRequest struct {
	Name        string                   `json:"name"`
	Description string                   `json:"description"`
	Options     []CreateTagOptionRequest `json:"options"`
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

func CreateTagReqToEntity(tag CreateTagRequest) *tag_entity.Tag {
	return &tag_entity.Tag{
		Name:        tag.Name,
		Description: tag.Description,
		Options:     createOptoinTagReqToEntity(tag.Options),
	}
}
