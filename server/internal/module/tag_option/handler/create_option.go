package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/tag_option/model/entity"
	"cse-question-bank/internal/module/tag_option/model/req"

	"github.com/gin-gonic/gin"
)

// CreateOption godoc
//
// @Summary		Create a option
// @Description	Create a option
// @Tags			Option
// @Accept			json
// @Produce		json
// @Param			CreateOptionRequest	body		req.CreateOptionRequest	true	"CreateOptionRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=entity.Option}
// @Failure	400 {object} response.ErrorResponse
// @Router			/options [post]
func (h optionHandlerImpl) CreateOption(c *gin.Context) {
	var request req.CreateOptionRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	option, err := h.optionUsecase.CreateOption(c, &entity.Option{Name: request.Name, TagID: request.TagId})
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", option)
}
