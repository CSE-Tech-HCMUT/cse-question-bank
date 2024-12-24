package tag_res

import (
	"cse-question-bank/internal/database/entity"
	subject_res "cse-question-bank/internal/module/subject/model/res"
	option_res "cse-question-bank/internal/module/tag_option/model/res"
)

type TagResponse struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	// TODO: Add table subject -> model subject
	Subject subject_res.SubjectResponse  `json:"subject"`
	Options []*option_res.OptionResponse `json:"options"`
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
		Subject:     *subject_res.EntityToSubjectResponse(&tag.Subject),
	}
}
