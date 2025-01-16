package req

import "github.com/google/uuid"

type CreateCommentRequest struct {
	Content string
	ReviewRequestId uuid.UUID
	// field for current user id
}

// func (req *CreateCommentRequest)