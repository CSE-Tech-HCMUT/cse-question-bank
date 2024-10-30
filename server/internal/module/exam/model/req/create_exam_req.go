package req

type CreateExamRequest struct {
	NumberQuestion int
	Subject        string
	FilterTags     []*FilterTag
}
