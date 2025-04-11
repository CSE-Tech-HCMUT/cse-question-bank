package handler

import (
	"cse-question-bank/internal/core/casbin"
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"
	"fmt"

	"github.com/gin-gonic/gin"
)

// FilterQuestion godoc
//
// @Summary		Get filtered questions
// @Description	Get filtered questions
// @Tags			Question
// @Accept			json
// @Produce		json
// @Param			CreateQuestionRequest	body		req.FilterQuestionRequest	true	"FilterQuestionRequest JSON"
// @Success		200	{object}	response.SuccessResponse{data=[]question_res.QuestionResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/questions/filter_question [post]
func (h *questionHandlerImpl) FilterQuestion(c *gin.Context) {
	var request req.FilterQuestionRequest

	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	policyObject := fmt.Sprintf("subject:%s", request.SubjectId.String())
	if err := casbin.CasbinCheckPermission(c, policyObject, casbin.MANAGE_QUESTION); err != nil {
		response.ResponseError(c, err)
		return
	}

	data, err := h.questionUsecase.FilterQuestion(c, request)

	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", data)
}
