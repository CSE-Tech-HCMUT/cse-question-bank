package tag_res

import (
	subject_res "cse-question-bank/internal/module/subject/model/res"
	option_res "cse-question-bank/internal/module/tag_option/model/res"
)

type TagResponse struct {
	Id          int `gorm:"primaryKey"`
	Name        string
	Description string
	// TODO: Add table subject -> model subject
	Subject subject_res.SubjectResponse `json:"subject"`
	Options []option_res.OptionResponse	`json:"options"`
}