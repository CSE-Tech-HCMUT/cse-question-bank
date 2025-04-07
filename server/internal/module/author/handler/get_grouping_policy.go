package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

// GetGroupingPolicy godoc
//
// @Summary		Get all group policies of system
// @Description	Get all group policies of system
// @Tags			Author
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=[][]string}
// @Failure	400 {object} response.ErrorResponse
// @Router			/author/get-grouping-policy [get]
func (h *authorHandlerImpl) GetGroupingPolicy(c *gin.Context) {
	policies, err := h.authorUsecase.GetGroupingPolicy(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", policies)
}
