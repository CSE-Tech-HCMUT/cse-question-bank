package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

// GetQuestion godoc
//
//	@Summary		Show a question
//	@Description	Show a question
//	@Tags			Question
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Question ID"
//	@Success		200	{object}	response.SuccessResponse{data=usecase.QuestionResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/questions/{id} [get]
func (h *questionHandlerImpl) GetQuestion(c *gin.Context) {
	questionId := c.Param("id")
	res, err := h.questionUsecase.GetQuestion(c, questionId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", res)
}
