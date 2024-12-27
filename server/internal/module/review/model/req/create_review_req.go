package req

import "github.com/google/uuid"

type CreateReviewRequest struct {
	QuestionId uuid.UUID `json:"questionId"`
}
