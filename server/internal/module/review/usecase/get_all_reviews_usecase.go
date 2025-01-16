package usecase

import (
	"context"
	"cse-question-bank/internal/module/review/model/res"
)

func (u *reviewUsecaseImpl) GetAllReviews(ctx context.Context) ([]*res.ReviewResponse, error) {
	reviews, err := u.reviewRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	reviewListResponse := make([]*res.ReviewResponse, 0)
	for _, review := range reviews {
		reviewListResponse = append(reviewListResponse, res.EntityToResponse(review))
	}

	return reviewListResponse, nil
}
