package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetUsedOption godoc
//
// @Summary		Check option is used or not
// @Description	Check option is used or not
// @Tags			Option
// @Accept			json
// @Produce		json
// @Param			Id	path		int	true	"Id int"
// @Success		200	{object}	response.SuccessResponse{data=int}
// @Failure	400 {object} response.ErrorResponse
// @Router			/options/{id}/get-used [post]
func (h optionHandlerImpl) GetUsedOption(c *gin.Context) {
	param := c.Param("id")

	optionId, err := strconv.Atoi(param)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	questionCount, err := h.optionUsecase.GetUsedOption(c, optionId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", questionCount)
}
