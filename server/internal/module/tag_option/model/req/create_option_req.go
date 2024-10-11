package req

import "cse-question-bank/internal/module/tag_option/model/entity"

type CreateOptionRequest struct {
	Name string
}

func CreateOptionReqToEntity(optionsReq []CreateOptionRequest) []entity.Option {
	optionsList := make([]entity.Option, 0)
	for _, optionReq := range optionsReq {
		option := entity.Option{
			Name: optionReq.Name,
		}
		optionsList = append(optionsList, option)
	}

	return optionsList
}
