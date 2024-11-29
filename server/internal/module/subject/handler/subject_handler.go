package handler

import (
	"cse-question-bank/internal/module/subject/usecase"

	"github.com/gin-gonic/gin"
)

type SubjectHandler interface {
	CreateSubject(c *gin.Context)
	UpdateSubject(c *gin.Context)
	GetAllSubjects(c *gin.Context)
	GetSubjectById(c *gin.Context)
	DeleteSubject(c *gin.Context)
}

type subjectHandlerImpl struct {
	subjectUsecase usecase.SubjectUsecase
}

func NewSubjectHandler(subjectUsecase usecase.SubjectUsecase) SubjectHandler {
	return &subjectHandlerImpl{
		subjectUsecase: subjectUsecase,
	}
}
