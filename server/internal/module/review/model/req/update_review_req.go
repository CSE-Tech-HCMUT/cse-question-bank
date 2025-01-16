package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

// Only use for change information of Review Request such as: status, ...
type UpdateReviewStatusRequest struct {
	Id     uuid.UUID
	Status string
}

func (req *UpdateReviewStatusRequest) ToEntity() *entity.ReviewRequest {
	return &entity.ReviewRequest{
		Id: req.Id,
		Status: req.Status,
	}
}
