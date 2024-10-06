package req

import (
	tag_entity "cse-question-bank/internal/module/question_tag/model/entity"
	"cse-question-bank/internal/module/question_tag_option/model/entity"
)

type UpdateTagRequest struct {
	Id          int
	Name        string
	Description string
	Options     []entity.Option
}

func UpdateTagReqToEntity(tag UpdateTagRequest) *tag_entity.Tag {
	return &tag_entity.Tag{
		Id:          tag.Id,
		Name:        tag.Name,
		Description: tag.Description,
		Options:     tag.Options,
	}
}
