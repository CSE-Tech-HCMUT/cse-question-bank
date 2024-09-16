package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model"
	"encoding/json"

	"github.com/gin-gonic/gin"
)

type CreateAnswerRequest struct {
	Content json.RawMessage `json:"answer-content" binding:"required"`
}

type CreateQuestionRequest struct {
	Content      string              `json:"content" binding:"required"`
	LatexContent string              `json:"latex-content" binding:"required"`
	Type         string              `json:"type" binding:"required"`
	Tag          string              `json:"tag" binding:"required"`
	Difficult    int                 `json:"difficult" binding:"required"`
	Answer       CreateAnswerRequest `json:"answer" binding:"required"`
}

func (h *questionHandlerImpl) CreateQuestion(c *gin.Context) {
	var req CreateQuestionRequest

	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.questionUsecase.CreateQuestion(c, h.createReqToQuestionModel(&req)); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}

func (h *questionHandlerImpl) createReqToQuestionModel(req *CreateQuestionRequest) *model.Question {
	return &model.Question{
		Content:      req.Content,
		Type:         model.QuestionType(req.Type),
		Tag:          req.Tag,
		Difficult:    req.Difficult,
		Answer: &model.Answer{
			Content: req.Answer.Content,
		},
	}
}
