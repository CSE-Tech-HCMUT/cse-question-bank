package handler

import (
	"cse-question-bank/internal/module/exam/usecase"

	"github.com/gin-gonic/gin"
)

type ExamHandler interface {
	GenerateExamAuto(c *gin.Context)
	GetExamFilteredQuestionsList(c *gin.Context)
	CreateExam(c *gin.Context)
	DeleteExam(c *gin.Context)
	GetExam(c *gin.Context)
	UpdateExam(c *gin.Context)
	GetAllExams(c *gin.Context)
}

type examHandlerImpl struct {
	examUsecase usecase.ExamUsecase
}

func NewExamHandler(examUsecase usecase.ExamUsecase) ExamHandler {
	return &examHandlerImpl{
		examUsecase: examUsecase,
	}
}
