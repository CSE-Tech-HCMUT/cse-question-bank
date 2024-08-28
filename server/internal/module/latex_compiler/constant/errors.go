package constant

import (
	ce "cse-question-bank/internal/core/errors"
	"net/http"
)

func ErrCreateFolder(err error) error {
	return ce.NewDomainError(
		http.StatusInternalServerError,
		err,
		"can not create folder for containing latex source",
		"ERR_CREATE_FOLDER",
	)
}

func ErrCompileLatex(err error) error {
	return ce.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to compile latex file",
		"ERR_COMPILE_LATEX",
	)
}

func ErrOpenFilePDF(err error) error {
	return ce.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to get file PDF",
		"ERR_OPEN_FILE_PDF",
	)
}

func ErrGetPDFContent(err error) error {
	return ce.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to get PDF content",
		"ERR_GET_PDF_CONTENT",
	)
}