package req

import "github.com/google/uuid"

type ShuffleExamReq struct {
	ExamId                   uuid.UUID `json:"examId"`
	NumberExams              int       `json:"numberExams"`
	IsShuffleInsideQuestions bool      `json:"isShuffleInsideQuestions"`
}
