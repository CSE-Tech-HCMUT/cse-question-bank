package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	request "cse-question-bank/internal/module/tag/model/req"

	"github.com/gin-gonic/gin"
)

//	CreateTag godoc
//
//	@Summary		Create a tag
//	@Description	Create a tag
//	@Tags			Tag
//	@Accept			json
//	@Produce		json
//	@Param			CreateTagRequest	body		req.CreateTagRequest	true	"CreateTagRequest JSON"
//	@Success		200	{object}	response.SuccessResponse{data=entity.Tag}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/tags [post]
func (h tagHandlerImpl) CreateTag(c *gin.Context) {
	var req request.CreateTagRequest

	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	tag, err := h.tagUsecase.CreateTag(c, request.CreateTagReqToEntity(req))
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tag)

}
