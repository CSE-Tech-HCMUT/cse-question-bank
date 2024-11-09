package exam_res

import "cse-question-bank/internal/module/question/model/res"

// in exam context
type FilterQuestionsList struct {
	ExpectedCount int
	Questions       []*QuestionFilterExam
	TagAssignments  []*TagAssignment
}

type QuestionFilterExam struct {
	*res.QuestionResponse
	IsUsed bool
}
