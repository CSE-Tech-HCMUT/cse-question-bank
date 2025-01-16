package usecase

import (
	"context"

	"github.com/google/uuid"
)

func (u *reviewUsecaseImpl) DeleteReview(ctx context.Context, reviewId uuid.UUID) error {
	return u.reviewRepository.Delete(ctx, nil, map[string]interface{}{
		"id": reviewId,
	})
} 