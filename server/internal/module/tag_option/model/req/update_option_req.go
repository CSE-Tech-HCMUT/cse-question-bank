package option_req

import "cse-question-bank/internal/database/entity"

type UpdateOptionRequest struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func UpdateOptionReqToEntity(optionsReq []UpdateOptionRequest) []entity.Option {
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
