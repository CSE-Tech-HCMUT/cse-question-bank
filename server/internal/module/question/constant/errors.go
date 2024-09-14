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

func ErrGetQuestion(err error) error {
	return de.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to get question",
		"ERR_GET_QUESTION",
	)
}

func ErrInvalidQuestionID(err error) error {
	return de.NewDomainError(
		http.StatusBadRequest,
		err,
		"invalid question id type",
		"ERR_INVALID_QUESTION_ID",
	)
}

func ErrEditQuestion(err error) error {
	return de.NewDomainError(
		http.StatusInternalServerError,
		err,
		"fail to edit question",
		"ERR_EDIT_QUESTION",
	)
}
