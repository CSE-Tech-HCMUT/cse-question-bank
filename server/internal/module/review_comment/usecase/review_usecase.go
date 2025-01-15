package usecase

import "cse-question-bank/internal/module/review/repository"

type ReviewUsecase interface{}

type reviewUsecaseImpl struct {
	reviewRepository repository.ReviewRepository
}

func NewReviewUsecase(reviewRepository repository.ReviewRepository) ReviewUsecase {
	return reviewUsecaseImpl{
		reviewRepository: reviewRepository,
	}
}

type ReviewStatus string

var (
	OpenRequest    ReviewStatus = "open"            // after create request
	PendingReview  ReviewStatus = "pending-review"  // after add reviewer
	StartingReview ReviewStatus = "starting-review" // reviewer start review
	PendingChange  ReviewStatus = "pending-change"  // reviewer require creator change in question
	Accepted       ReviewStatus = "accepted"        // reviewer accept request
	Rejected       ReviewStatus = "rejected"        // reviewer reject request
)
