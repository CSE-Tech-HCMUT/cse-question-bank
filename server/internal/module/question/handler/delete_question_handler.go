package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/response"
	"fmt"

	"github.com/gin-gonic/gin"
)

// DeleteQuestion godoc
//
//	@Summary		Delete a question
//	@Description	Delete a question
//	@Tags			Question
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Question ID"
//	@Success		200	{object}	response.SuccessResponse{data=interface{}}
//	@Failure		400 {object} 	response.ErrorResponse
//	@Router			/questions/{id} [delete]
func (h *questionHandlerImpl) DeleteQuestion(c *gin.Context) {
	questionId := c.Param("id")

	policyObject := fmt.Sprintf("question:%s", questionId)
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_QUESTION); err != nil {
		response.ResponseError(c, err)
		return
	}

	if err := h.questionUsecase.DeleteQuestion(c, questionId); err != nil {
		response.ResponseError(c, err)
		return
	}

	if err := casbin.RemovePolicyByObject(c, policyObject); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
