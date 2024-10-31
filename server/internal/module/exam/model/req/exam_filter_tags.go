package req

type GenerateExamAuto struct {
	NumberQuestion int	`json:"numberQuestion"`
	Subject         string	`json:"subject"`
	FilterTags []*FilterTag	`json:"filterTags"`
}

type FilterTag struct {
	NumberQuestion int	`json:"numberQuestion"`
	TagAssignments []*TagAssignment	`json:"tagAssignments"`
}

// exam side
type TagAssignment struct {
	TagId           int	`json:"tagId"`
	OptionId        int	`json:"optionId"`
}
