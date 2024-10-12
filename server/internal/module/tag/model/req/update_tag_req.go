package req

import (
	tag_entity "cse-question-bank/internal/module/tag/model/entity"
	option_req "cse-question-bank/internal/module/tag_option/model/req"
)

type UpdateTagRequest struct {
	Id          int                              `json:"id"`
	Name        string                           `json:"name"`
	Description string                           `json:"description"`
	Options     []option_req.UpdateOptionRequest `json:"options"`
}

func UpdateTagReqToEntity(tag UpdateTagRequest) *tag_entity.Tag {
	return &tag_entity.Tag{
		Id:          tag.Id,
		Name:        tag.Name,
		Description: tag.Description,
		Options:     option_req.UpdateOptionReqToEntity(tag.Options),
	}
}
