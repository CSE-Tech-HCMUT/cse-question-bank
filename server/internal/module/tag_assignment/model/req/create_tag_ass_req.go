package req

type CreateTagAssignmentRequest struct {
	TagId    int `json:"tagId"`
	OptionId int `json:"optionId"`
}
