package req

import "cse-question-bank/internal/database/entity"

type CreateOptionRequest struct {
	Name string
	TagId int
}

func CreateOptionReqToEntity(optionsReq []CreateOptionRequest) []entity.Option {
	optionsList := make([]entity.Option, 0)
	for _, optionReq := range optionsReq {
		option := entity.Option{
			Name: optionReq.Name,
			TagID: optionReq.TagId,
		}
		optionsList = append(optionsList, option)
	}

	return optionsList
}
