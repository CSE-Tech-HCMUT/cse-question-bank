package errors

import "errors"

// type DomainError interface {
// 	ErrorKey() ErrorKey
// 	ErrorMessage() string
// 	Error() string
// }

type ErrorKey string

type DomainError struct {
	StatusCode int
	RootError  error
	Message    string
	ErrorKey   string
}

func (e *DomainError) Error() string {
	return e.RootError.Error()
}

func NewDomainError(statusCode int, rootError error, message string, errorKey string) *DomainError {
	if rootError == nil {
		rootError = errors.New(message)
	}

	return &DomainError{
		StatusCode: statusCode,
		RootError:  rootError,
		Message:    message,
		ErrorKey:   errorKey,
	}
}

// var (
// 	ErrNotFound       = ErrorKey("ERR_NOT_FOUND")
// 	ErrInvalidInput   = ErrorKey("ERR_INVALID_INPUT")
// 	ErrInternalServer = ErrorKey("ERR_INTERNAL_SERVER")
// )
