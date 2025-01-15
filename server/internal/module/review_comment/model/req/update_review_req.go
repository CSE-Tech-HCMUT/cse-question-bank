package req

import "github.com/google/uuid"

// Only use for change information of Review Request such as: status, ...
type UpdateReviewRequest struct {
	Id         uuid.UUID
	Status     string    
}
