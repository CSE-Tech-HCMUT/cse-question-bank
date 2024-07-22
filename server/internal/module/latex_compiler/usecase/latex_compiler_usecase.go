package usecase

import (
	"cse-question-bank/internal/core/errors"
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
	LatexCompile(content string) ([]byte, errors.DomainError)
}

type latexCompilerImpl struct {
}

func NewLatexCompiler() LatexCompilerUsecase {
	return &latexCompilerImpl{}
}
