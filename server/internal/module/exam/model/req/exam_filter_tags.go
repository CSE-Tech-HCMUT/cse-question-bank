package req

type GenerateEvxamAuto struct {
	NumberQuestion int	`json:"numberQuestion"`
	Subject         string	`json:"subject"`
	FilterConditions []*FilterCondition	`json:"filterTags"`
}