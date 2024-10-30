package exam_res

import "cse-question-bank/internal/module/question/model/res"

type ExamResponse struct {
	Subject         string
	NumberQuestions int
	Questions       []*res.QuestionResponse
}
