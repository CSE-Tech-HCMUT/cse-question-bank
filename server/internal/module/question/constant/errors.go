package constant

import (
	de "cse-question-bank/internal/core/errors"
	"net/http"
)
func ErrQuestionNotFound(err error) error {
	return de.NewDomainError(
		http.StatusNotFound,
		err,
		"request question not found",
		"ERR_QUESTION_NOT_FOUND",
	)
}

func ErrQuestionTypeNotSupport(err error) error {
	return de.NewDomainError(
		http.StatusBadRequest,
		err,
		"request question type not support",
		"ERR_QUESTION_TYPE_NOT_SUPPORT",
	)
}

func ErrUpdateQuestion(err error) error {
	return de.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to update question",
		"ERR_UPDATE_QUESTION",
	)
}

func ErrDeleteQuestion(err error) error {
	return de.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to delete question",
		"ERR_DELETE_QUESTION",
	)
}

func ErrCreateQuestion(err error) error {
	return de.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to create question",
		"ERR_CREATE_QUESTION",
	)
}