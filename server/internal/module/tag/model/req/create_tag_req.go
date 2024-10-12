package req

import (
	tag_entity "cse-question-bank/internal/module/tag/model/entity"
	"cse-question-bank/internal/module/tag_option/model/req"
)

type CreateTagRequest struct {
	Name        string	`json:"name"`
	Description string	`json:"description"`
	Options     []req.CreateOptionRequest	`json:"options"`
}

func CreateTagReqToEntity(tag CreateTagRequest) *tag_entity.Tag {
	return &tag_entity.Tag{
		Name:        tag.Name,
		Description: tag.Description,
		Options:     req.CreateOptionReqToEntity(tag.Options),
	}
}
