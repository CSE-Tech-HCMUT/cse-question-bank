package req

type GenerateExamAuto struct {
	NumberQuestions int
	Subject         string
	FilterTags      []*FilterTag
}

// exam side
type FilterTag struct {
	NumberQuestions int
	TagId           int
	OptionId        int
}
