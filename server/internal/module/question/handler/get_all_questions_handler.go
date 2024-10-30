package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

//	GetAllQuestions godoc
//
//	@Summary		Get all questions
//	@Description	Get all questions
//	@Tags			Question
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	response.SuccessResponse{data=[]usecase.QuestionResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/questions [get]
func (h questionHandlerImpl) GetAllQuestions(c *gin.Context) {
	questions, err := h.questionUsecase.GetAllQuestions(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", questions)
}
