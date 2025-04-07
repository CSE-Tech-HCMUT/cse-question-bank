package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"
	"fmt"

	"github.com/gin-gonic/gin"
)

// CreateQuestion godoc
//
// @Summary		Create a question
// @Description	Create a question
// @Tags			Question
// @Accept			json
// @Produce		json
// @Param			CreateQuestionRequest	body		req.CreateQuestionRequest	true	"CreateQuestionRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=question_res.QuestionResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/questions [post]
func (h *questionHandlerImpl) CreateQuestion(c *gin.Context) {
	var request req.CreateQuestionRequest

	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}
	
	policyObject := fmt.Sprintf("subject:%s", request.SubjectId.String())
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_QUESTION); err != nil {
		response.ResponseError(c, err)
		return
	}

	data, err := h.questionUsecase.CreateQuestion(c, req.CreateReqToQuestionModel(&request))

	if err != nil {
		response.ResponseError(c, err)
		return
	}

	policySub := fmt.Sprintf("teacher_subject:%s", request.SubjectId.String())
	policyObject = fmt.Sprintf("question:%s", data.Id)
	if err := casbin.AddPolicy(c, policySub, policyObject, casbin.MANAGE_QUESTION); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", data)
}
