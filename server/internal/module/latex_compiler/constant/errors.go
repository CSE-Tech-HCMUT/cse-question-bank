package constant

import (
	"cse-question-bank/internal/core/errors"
)

type LatexCompilerError struct {
	Key     errors.ErrorKey
	Message string
}

func (e *LatexCompilerError) ErrorKey() errors.ErrorKey {
	return e.Key
}

func (e *LatexCompilerError) ErrorMessage() string {
	return e.Message
}

func (e *LatexCompilerError) Error() string {
	return e.Message
}

func newDomainError(key errors.ErrorKey, message string) errors.DomainError {
	return &LatexCompilerError{
		Key:     key,
		Message: message,
	}
}

func NewInternalServerError() errors.DomainError {
	return newDomainError(errors.ErrInternalServer, "Can not compile latex now. Please try again later")
}
