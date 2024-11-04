package usecase

import (
	"context"
	er "cse-question-bank/internal/module/exam/repository"
	qr "cse-question-bank/internal/module/question/repository"

	"github.com/google/uuid"
)

// flow
// get request -> get latex content
// -> embed to latex template question
// -> create folder in latex_source with name is project id -> integrate to this direction
// -> call excution to pdflatex
// -> get response from excution
// 		-> SUCCESS: send response with pdf file
// 		-> FAIL: send response with message error
// -> delete pdf file, delete latex folder

type LatexCompilerUsecase interface {
	CompileQuestionLatex(ctx context.Context, questionId uuid.UUID) ([]byte, error)
	CompileExamLatex(ctx context.Context, examId uuid.UUID) ([]byte, error)
}

type latexCompilerImpl struct {
	examRepository     er.ExamRepository
	questionRepository qr.QuestionRepository
}

func NewLatexCompiler(
	examRepository er.ExamRepository,
	questionRepository qr.QuestionRepository,
) LatexCompilerUsecase {
	return &latexCompilerImpl{
		examRepository: examRepository,
		questionRepository: questionRepository,
	}
}
