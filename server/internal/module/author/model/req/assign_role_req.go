package req

import "github.com/google/uuid"

type AssignRoleRequest struct {
	UserId uuid.UUID `json:"userId"`
	Role   string    `json:"role"`
}
