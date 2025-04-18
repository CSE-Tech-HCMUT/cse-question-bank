package usecase

import (
	"context"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	er "cse-question-bank/internal/module/exam/repository"
	qr "cse-question-bank/internal/module/question/repository"
	tr "cse-question-bank/internal/module/tag/repository"

	"github.com/google/uuid"
)

type ExamUsecase interface {
	CreateExam(ctx context.Context, request req.CreateExamRequest) (*exam_res.ExamResponse, error)
	GenerateExamAuto(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error)
	GetExamFilteredQuestionsList(ctx context.Context, examId uuid.UUID) ([]*exam_res.FilterQuestionsList, error)
	GetExam(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error)
	DeleteExam(ctx context.Context, examId uuid.UUID) error
	UpdateExam(ctx context.Context, request *req.UpdateExamRequest) (*exam_res.ExamResponse, error)
	GetAllExams(ctx context.Context) ([]*exam_res.ExamResponse, error)
	ShuffleExam(ctx context.Context, request req.ShuffleExamReq) ([]*exam_res.ExamResponse, error)
}

type examUsecaseImpl struct {
	tagRepository      tr.TagRepository
	questionRepository qr.QuestionRepository
	examRepostiroy     er.ExamRepository
}

func NewExamUsecase(
	tagRepository tr.TagRepository,
	questionRepository qr.QuestionRepository,
	examRepository er.ExamRepository,
) ExamUsecase {
	return &examUsecaseImpl{
		tagRepository:      tagRepository,
		questionRepository: questionRepository,
		examRepostiroy:     examRepository,
	}
}

// CreateExam
// Same logic with Question: Setting -> Create in draft then fill the content (update api)

// UpdateExam
// Just work with rearange question position or add/remove question in exam
// We approve user to edit question content, but need some mechanic to handle it
// how we control it -> keyword: Operational Transformation (OT)

// Exam model:
/*
{
	"id": "uuid",
	"numberQuestions": 0,
	"tags" : [],
	"questions": [
		{
			"id": "", 	// => just need the id, because on update exam, we just rearrange the position of questions,
						// => the content will update in question's API
		},
		{
			"id"; "",
		},
	]
}

*/
