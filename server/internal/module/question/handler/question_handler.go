package handler

import (
	"cse-question-bank/internal/module/question/usecase"
	"github.com/gin-gonic/gin"	
)

type QuestionHandler interface {
	CreateQuestion(c *gin.Context)
	GetQuestion(c *gin.Context)
	DeleteQuestion(c *gin.Context)
	EditQuestion(c *gin.Context)
}

type questionHandlerImpl struct {
	questionUsecase usecase.QuestionUsecase
}

func NewQuestionHandler(questionUsecase usecase.QuestionUsecase) QuestionHandler {
	return &questionHandlerImpl{
		questionUsecase: questionUsecase,
	}
}