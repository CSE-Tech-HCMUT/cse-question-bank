package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/author/model/req"

	"github.com/gin-gonic/gin"
)

// AssignRole godoc
//
// @Summary		Assign Role for user
// @Description	Assign Role for user.
// @Description Using this API, you can assign a role to a user. The role is defined in the system and can be used to control access to resources.
// @Description Using Get /author/get-all-roles to get all roles in system and /author/get-all-policies to get all policies in system.
// @Tags			Author
// @Accept			json
// @Produce		json
// @Param			AssignRoleRequest	body		req.AssignRoleRequest	true	"AssignRoleRequest JSON"
// @Success		200	{object}	response.SuccessResponse{}
// @Failure	400 {object} response.ErrorResponse
// @Router			/author/assign-role [post]
func (h *authorHandlerImpl) AssignRole(c *gin.Context) {
	var request req.AssignRoleRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.authorUsecase.AssignRole(c, &request); err != nil {
		response.ResponseError(c, err)
		return
	}
}
