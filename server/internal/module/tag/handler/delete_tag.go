package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

//	DeleteTag godoc
//
//	@Summary		Delete a tag
//	@Description	Delete a tag
//	@Tags			Tag
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"Id int"
//	@Success		200	{object}	response.SuccessResponse
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/tags/{id} [delete]
func (h tagHandlerImpl) DeleteTag(c *gin.Context) {
	paramId := c.Param("id")

	tagId, err := strconv.Atoi(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.tagUsecase.DeleteTag(c, tagId); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
