package usecase

import "cse-question-bank/internal/module/question/repository"

type questionBaseUsecaseImpl struct {
	repo repository.QuestionRepository
}
