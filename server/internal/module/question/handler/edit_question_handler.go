package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model/req"

	"github.com/gin-gonic/gin"
)

//	EditQuestion godoc
//
//	@Summary		Edit a question
//	@Description	Edit a question
//	@Tags			Question
//	@Accept			json
//	@Produce		json
//	@Param			EditQuestionRequest	body		req.EditQuestionRequest	true	"EditQuestionReq JSON"
//	@Success		200	{object}	response.SuccessResponse
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/questions/{id} [put]
func (h *questionHandlerImpl) EditQuestion(c *gin.Context) {
	var request req.EditQuestionRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.questionUsecase.EditQuestion(c, req.EditReqToQuestionModel(&request)); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}
