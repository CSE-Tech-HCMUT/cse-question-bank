package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	request "cse-question-bank/internal/module/tag/model/req"
	"fmt"

	"github.com/gin-gonic/gin"
)

// UpdateTag godoc
//
// @Summary		Edit a tag
// @Description	Edit a tag
// @Tags			Tag
// @Accept			json
// @Produce		json
// @Param			UpdateTagRequest	body		req.UpdateTagRequest	true	"UpdateTagRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=tag_res.TagResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/tags [put]
func (h tagHandlerImpl) UpdateTag(c *gin.Context) {
	var req request.UpdateTagRequest
	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	policyObject := fmt.Sprintf("subject:%s", req.SubjectId.String())
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_SUBJECT); err != nil {
		response.ResponseError(c, err)
		return
	}

	err := h.tagUsecase.UpdateTag(c, request.UpdateTagReqToEntity(req))
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
