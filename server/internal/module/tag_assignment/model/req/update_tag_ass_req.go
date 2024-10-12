package req

type UpdateTagAssignmentRequest struct {
	Id       int `json:"id"`
	TagId    int `json:"tagId"`
	OptionId int `json:"optionId"`
}
