package req

import (
	option_entity "cse-question-bank/internal/module/question_tag_option/model/entity"
	tag_entity "cse-question-bank/internal/module/question_tag/model/entity"
)
type CreateTagRequest struct {
	Name        string
	Description string
	Options     []option_entity.Option
}

func CreateTagReqToEntity(tag CreateTagRequest) *tag_entity.Tag {
	return &tag_entity.Tag{
		Name: tag.Name,
		Description: tag.Description,
		Options: tag.Options,
	}
}
