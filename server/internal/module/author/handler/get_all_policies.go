package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

// GetAllPolicies godoc
//
// @Summary		Get all policies of system
// @Description	Get all policies of system
// @Tags			Author
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=[][]string}
// @Failure	400 {object} response.ErrorResponse
// @Router			/author/get-all-policies [get]
func (h *authorHandlerImpl) GetAllPolicies(c *gin.Context) {

	policies, err := h.authorUsecase.GetAllPolicies(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", policies)
}
