package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

//	GetAllTags godoc
//
//	@Summary		Show all tags
//	@Description	Show all tags
//	@Tags			Tag
//	@Accept			json
//	@Produce		json
//	@Success		200	{object} response.SuccessResponse{data=[]entity.Tag}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/tags [get]
func (h tagHandlerImpl) GetAllTags(c *gin.Context) {
	tagList, err := h.tagUsecase.GetAllTag(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tagList)
}
