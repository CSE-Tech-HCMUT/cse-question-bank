package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

//	GetTagById godoc
//
//	@Summary		Show a tag
//	@Description	Show a tag
//	@Tags			Tag
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"Id int"
//	@Success		200	{object}	response.SuccessResponse{data=entity.Tag}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/tags/{id} [get]
func (h tagHandlerImpl) GetTagById(c *gin.Context) {
	paramId := c.Param("id")
	tagId, err := strconv.Atoi(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	tag, err := h.tagUsecase.GetTag(c, tagId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tag)
}
