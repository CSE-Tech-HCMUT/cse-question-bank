package usecase

import (
	"cse-question-bank/pkg/execute"
	"time"
)

// flow
// get request -> get latex content
// -> embed to latex template question
// -> call excution to pdflatex
// -> get response from excution
// 		-> SUCCESS: send response with pdf file
// 		-> FAIL: send response with message error
// -> delete pdf file

type LatexCompilerUsecase interface{
	PdfLatexCompile(filename string, args ...string) error
}

type latexCompilerImpl struct {
	
}

func (u *latexCompilerImpl) latextool(toolname string, filename string, args ...string) error {
	execute := execute.NewExecutor(10*time.Second)
	args = append(args, filename)

	err := execute.RunCommand(toolname, args...)
	if err != nil {
		return err
	}

	return nil
}

func (u *latexCompilerImpl) PdfLatexCompile(filename string, args ...string) error {
	return u.latextool("pdflatex", filename, args...)
}