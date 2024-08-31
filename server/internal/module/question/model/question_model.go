package model

type QuestionType string

var (
	MultipleChoice QuestionType = "multiple_choice"
	DragAndDrop    QuestionType = "drag_and_drop"
	FillInBlank    QuestionType = "fill_in_blank"
)

type Question struct {
	Id           string
	Content      string
	LatexContent string
	IsParent     bool
	ParentId     string
	RelateId     string
	Type         QuestionType
	Tag          string
	Difficult    int
	TopicId      string
}
