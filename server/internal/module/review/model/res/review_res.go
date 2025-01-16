package res

import (
	"cse-question-bank/internal/database/entity"

	"github.com/google/uuid"
)

type QuestionReponse struct {
	Id uuid.UUID `json:"id"`
}

type CommentResponse struct {
	Id uuid.UUID `json:"id"`
}

type ReviewResponse struct {
	Id        uuid.UUID          `json:"id"`
	Questions []*QuestionReponse `json:"questions"`
	Status    string             `json:"status"`
	Comments  []*CommentResponse `json:"comment"`
}

func EntityToResponse(review *entity.ReviewRequest) *ReviewResponse {
	questions := make([]*QuestionReponse, 0)
	for _, question := range review.Questions {
		questions = append(questions, &QuestionReponse{
			Id: question.Id,
		})
	}

	comments := make([]*CommentResponse, 0)
	for _, comment := range review.Comments {
		comments = append(comments, &CommentResponse{
			Id: comment.Id,
		})
	}

	return &ReviewResponse{
		Id:        review.Id,
		Questions: questions,
		Comments:  comments,
	}
}
