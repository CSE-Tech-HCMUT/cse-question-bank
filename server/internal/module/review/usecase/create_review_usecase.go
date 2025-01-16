package usecase

import (
	"context"
	"cse-question-bank/internal/module/review/model/req"
	"cse-question-bank/internal/module/review/model/res"
)

func (u *reviewUsecaseImpl) CreateReviewRequest(ctx context.Context, request req.CreateReviewRequest) (*res.ReviewResponse, error) {
	review := request.ToEntity()

	err := u.reviewRepository.Create(ctx, nil, review)
	if err != nil {
		return nil, err
	}

	reviews, err := u.reviewRepository.Find(ctx, nil, map[string]interface{}{
		"id": review.Id,
	})

	if err != nil {
		return nil, err
	}

	return res.EntityToResponse(reviews[0]), nil
}
