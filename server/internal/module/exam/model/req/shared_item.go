package req

type FilterCondition struct {
	Id             int              `json:"id"`
	ExpectedCount  int              `json:"numberQuestion"`
	TagAssignments []*TagAssignment `json:"tagAssignments"`
}

// exam side
type TagAssignment struct {
	Id       int `json:"id"`
	TagId    int `json:"tagId"`
	OptionId int `json:"optionId"`
}
