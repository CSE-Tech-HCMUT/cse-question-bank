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