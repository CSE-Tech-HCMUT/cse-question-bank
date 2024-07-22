package errors

type DomainError interface {
    ErrorKey() ErrorKey
    ErrorMessage() string
    Error() string
}

type ErrorKey string

var (
    ErrNotFound       = ErrorKey("ERR_NOT_FOUND")
    ErrInvalidInput   = ErrorKey("ERR_INVALID_INPUT")
    ErrInternalServer = ErrorKey("ERR_INTERNAL_SERVER")
)