package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type UpdateTagRequest struct {
	Id          int                   `json:"id"`
	Name        string                `json:"name"`
	Description string                `json:"description"`
	Options     []UpdateOptionRequest `json:"options"`
	SubjectId   uuid.UUID             `json:"subjectId"`
}

type UpdateOptionRequest struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func updateOptionReqToEntity(optionsReq []UpdateOptionRequest) []entity.Option {
	optionsList := make([]entity.Option, 0)
	for _, optionReq := range optionsReq {
		option := entity.Option{
			Id:   optionReq.Id,
			Name: optionReq.Name,
		}
		optionsList = append(optionsList, option)
	}

	return optionsList
}

func UpdateTagReqToEntity(tag UpdateTagRequest) *entity.Tag {
	return &entity.Tag{
		Id:          tag.Id,
		Name:        tag.Name,
		Description: tag.Description,
		Options:     updateOptionReqToEntity(tag.Options),
		SubjectId:   tag.SubjectId,
	}
}
