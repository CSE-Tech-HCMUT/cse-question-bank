package model

type Question struct {
	Id           string
	Content      string
	LatexContent string
	IsParent     bool
	ParentId     string
	RelateId     string
	Type         string
	Tag          string
	Difficult    int
	TopicId      string
}
