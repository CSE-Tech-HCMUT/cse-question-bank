package handler

import ()

type LatexCompilerHandler interface {}

type latexCompilerHandlerImpl struct {}

func NewLatexCompilerHandler() LatexCompilerHandler {
	return &latexCompilerHandlerImpl{}
}