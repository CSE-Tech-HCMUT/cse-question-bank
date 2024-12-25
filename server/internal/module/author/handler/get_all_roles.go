package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

// GetAllRoles godoc
//
// @Summary		Get all roles of system
// @Description	Get all roles of system
// @Tags			Author
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=[]string}
// @Failure	400 {object} response.ErrorResponse
// @Router			/author/get-all-roles [get]
func (h *authorHandlerImpl) GetAllRoles(c *gin.Context) {

	roles, err := h.authorUsecase.GetAllRoles(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", roles)
}
