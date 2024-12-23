package exam_res

import question_res "cse-question-bank/internal/module/question/model/res"

// in exam context
type FilterQuestionsList struct {
	ExpectedCount int
	Questions       []*QuestionFilterExam
	TagAssignments  []*TagAssignment
}

type QuestionFilterExam struct {
	*question_res.QuestionResponse
	IsUsed bool
}
