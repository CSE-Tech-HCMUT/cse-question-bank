package usecase

import (
	"context"
	"cse-question-bank/internal/module/review/constant"
	"cse-question-bank/internal/module/review/model/req"
	"cse-question-bank/internal/module/review/model/res"
	"errors"
)

func (u *reviewUsecaseImpl) UpdateReviewStatus(ctx context.Context, request *req.UpdateReviewStatusRequest) (*res.ReviewResponse, error) {
	reviews, err := u.reviewRepository.Find(ctx, nil, map[string]interface{}{
		"id": request.Id,
	})

	if err != nil {
		return nil, err
	}
	review := reviews[0]

	current := constant.ReviewStatus(review.Status)
	updated := constant.ReviewStatus(request.Status)

	if !isValidStatusTransition (current, updated) {
		return nil, errors.New("oops")
	}

	review = request.ToEntity()
	err = u.reviewRepository.Update(ctx, nil, review)
	if err != nil {
		return nil, err
	}

	return res.EntityToResponse(review), nil
}

var statusTransitions = map[constant.ReviewStatus][]constant.ReviewStatus{
	constant.OpenRequest: {constant.PendingReview, constant.Closed},
	constant.PendingReview: {constant.StartingReview},
	constant.StartingReview: {constant.PendingReview, constant.PendingChange, constant.Accepted, constant.Rejected},
	constant.PendingChange: {constant.StartingChange, constant.Closed},
	constant.StartingChange: {constant.PendingChange, constant.PendingReview, constant.Closed},
	constant.Accepted: {},
	constant.Rejected: {},
	constant.Closed: {},
}

func isValidStatusTransition(current constant.ReviewStatus, updated constant.ReviewStatus) bool {
	allowedStatuses, exists := statusTransitions[current]
	if !exists {
		return false
	}

	for _, status := range allowedStatuses {
		if status == updated {
			return true
		}
	}

	return false
}
