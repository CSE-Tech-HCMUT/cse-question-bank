package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	request "cse-question-bank/internal/module/tag/model/req"
	"fmt"

	"github.com/gin-gonic/gin"
)

// CreateTag godoc
//
// @Summary		Create a tag
// @Description	Create a tag
// @Tags			Tag
// @Accept			json
// @Produce		json
// @Param			CreateTagRequest	body		req.CreateTagRequest	true	"CreateTagRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=tag_res.TagResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/tags [post]
func (h tagHandlerImpl) CreateTag(c *gin.Context) {
	var req request.CreateTagRequest

	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	policyObject := fmt.Sprintf("subject:%s", req.SubjectId.String())
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_SUBJECT); err != nil {
		response.ResponseError(c, err)
		return
	}

	tag, err := h.tagUsecase.CreateTag(c, request.CreateTagReqToEntity(req))
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", tag)

}
