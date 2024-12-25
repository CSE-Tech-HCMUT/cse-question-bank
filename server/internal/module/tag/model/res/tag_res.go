package tag_res

import (
	"cse-question-bank/internal/database/entity"
	department_res "cse-question-bank/internal/module/department/model/res"
	option_res "cse-question-bank/internal/module/tag_option/model/res"

	"github.com/google/uuid"
)

type TagResponse struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	// TODO: Add table subject -> model subject
	Subject *SubjectResponse              `json:"subject"`
	Options []*option_res.OptionResponse `json:"options"`
}

type SubjectResponse struct {
	Id         uuid.UUID                         `json:"id"`
	Name       string                            `json:"name"`
	Code       string                            `json:"code"`
	Department department_res.DepartmentResponse `json:"department"`
}

func EntityToResponse(tag *entity.Tag) *TagResponse {
	optionRes := make([]*option_res.OptionResponse, 0)
	for _, option := range tag.Options {
		optionRes = append(optionRes, &option_res.OptionResponse{
			Id:   option.Id,
			Name: option.Name,
		})
	}

	return &TagResponse{
		Id:          tag.Id,
		Name:        tag.Name,
		Description: tag.Description,
		Options:     optionRes,
		Subject: &SubjectResponse{
			Id:         tag.Subject.Id,
			Name:       tag.Subject.Name,
			Code:       tag.Subject.Code,
			Department: *department_res.EntityToDepartmentResponse(&tag.Subject.Department),
		},
	}
}
