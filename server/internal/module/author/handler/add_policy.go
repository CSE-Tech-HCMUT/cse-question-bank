package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/author/model/req"

	"github.com/gin-gonic/gin"
)

// AddPolicy godoc
//
// @Summary		Add policy for system to authen user
// @Description	Add policy for system to authen user. Where "role" is the role of user, "object" is the resource user have permission to and "action" is the action user can do on that resource.
// @Description	Example: role = "subject_manager:<subject-id>", object = "subject:<subject-id>", action = "manage_subject" means subject manager can do everything on subject resource.
// @Tags			Policy
// @Accept			json
// @Produce		json
// @Param			AddPolicyRequest	body		req.AddPolicyRequest	true	"AddPolicyRequest JSON"
// @Success		200	{object}	response.SuccessResponse{}
// @Failure	400 {object} response.ErrorResponse
// @Router			/author/add-policy [post]
func (h *authorHandlerImpl) AddPolicy(c *gin.Context) {
	var request req.AddPolicyRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.authorUsecase.AddPolicy(c, &request); err != nil {
		response.ResponseError(c, err)
		return
	}
}
