package exam_res

import "cse-question-bank/internal/module/question/model/res"

// in exam context
type FilterQuestionsList struct {
	NumberQuestions int
	Questions       []*QuestionFilterExam
}

type QuestionFilterExam struct {
	*res.QuestionResponse
	IsUsed bool
}
