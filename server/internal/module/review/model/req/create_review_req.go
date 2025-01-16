package req

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type CreateReviewRequest struct {
	QuestionId uuid.UUID `json:"questionId"`
}

func (req *CreateReviewRequest) ToEntity() *entity.ReviewRequest {
	return &entity.ReviewRequest{
		QuestionId: req.QuestionId,
	}
}
