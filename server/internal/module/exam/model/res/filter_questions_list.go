package exam_res

import question_res "cse-question-bank/internal/module/question/model/res"

// in exam context
type FilterQuestionsList struct {
	Id             int                   `json:"id"`
	ExpectedCount  int                   `json:"numberQuestion"`
	TagAssignments []*TagAssignment      `json:"tagAssignments"`
	Questions      []*QuestionFilterExam `json:"questions"`
}

type QuestionFilterExam struct {
	*question_res.QuestionResponse
	IsUsed bool
}
