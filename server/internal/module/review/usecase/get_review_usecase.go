package usecase

import (
	"context"
	"cse-question-bank/internal/module/review/model/res"

	"github.com/google/uuid"
)

func (u *reviewUsecaseImpl) GetReviewById(ctx context.Context, reviewId uuid.UUID) (*res.ReviewResponse, error) {
	review, err := u.reviewRepository.Find(ctx, nil, map[string]interface{}{
		"id": reviewId,
	})

	if err != nil {
		return nil, err
	}

	return res.EntityToResponse(review[0]), nil
}
