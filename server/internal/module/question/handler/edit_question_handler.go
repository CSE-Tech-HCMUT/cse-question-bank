package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"
	"fmt"

	"github.com/gin-gonic/gin"
)

// EditQuestion godoc
//
// @Summary		Edit a question
// @Description	Edit a question
// @Tags			Question
// @Accept			json
// @Produce		json
// @Param			EditQuestionRequest	body		req.EditQuestionRequest	true	"EditQuestionReq JSON"
// @Success		200	{object}	response.SuccessResponse{data=interface{}}
// @Failure	400 {object} response.ErrorResponse
// @Router			/questions [put]
func (h *questionHandlerImpl) EditQuestion(c *gin.Context) {
	var request req.EditQuestionRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	policyObject := fmt.Sprintf("subject:%s", request.SubjectId.String())
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_QUESTION); err != nil {
		response.ResponseError(c, err)
		return
	}

	if err := h.questionUsecase.EditQuestion(c, req.EditReqToQuestionModel(&request)); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
