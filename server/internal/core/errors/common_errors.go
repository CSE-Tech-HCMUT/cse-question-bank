package errors

import "net/http"

func ErrInvalidInput(err error) error {
	return NewDomainError(
		http.StatusBadRequest,
		err,
		"invalid input",
		"ERR_INVALID_INPUT",
	)
}
