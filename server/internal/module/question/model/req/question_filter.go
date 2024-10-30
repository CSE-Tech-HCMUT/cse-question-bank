package req

type QuestionFilter struct {
	Tags []string `json:"tags"`
	Subject string `json:"subject"`
}