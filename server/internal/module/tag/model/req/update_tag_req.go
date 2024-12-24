package req

import (
	"cse-question-bank/internal/database/entity"
	option_req "cse-question-bank/internal/module/tag_option/model/req"

	"github.com/google/uuid"
)

type UpdateTagRequest struct {
	Id          int                              `json:"id"`
	Name        string                           `json:"name"`
	Description string                           `json:"description"`
	Options     []option_req.UpdateOptionRequest `json:"options"`
	SubjectId uuid.UUID	`json:"subjectId"`
}

func UpdateTagReqToEntity(tag UpdateTagRequest) *entity.Tag {
	return &entity.Tag{
		Id:          tag.Id,
		Name:        tag.Name,
		Description: tag.Description,
		Options:     option_req.UpdateOptionReqToEntity(tag.Options),
		SubjectId: tag.SubjectId,
	}
}
