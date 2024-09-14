package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/question/model"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type EditAnswerRequest struct {
	Id      string          `json:"id"`
	Content json.RawMessage `json:"answer-content"`
}

type EditQuestionRequest struct {
	Id           string            `json:"id"`
	Content      string            `json:"content"`
	LatexContent string            `json:"latex-content"`
	Type         string            `json:"type"`
	Tag          string            `json:"tag"`
	Difficult    int               `json:"difficult"`
	Answer       EditAnswerRequest `json:"answer"`
}

func (h *questionHandlerImpl) EditQuestion(c *gin.Context) {
	var req EditQuestionRequest
	if err := c.ShouldBind(&req); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.questionUsecase.EditQuestion(c, h.editReqToQuestionModel(&req)); err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "success", nil)
}

func (h *questionHandlerImpl) editReqToQuestionModel(req *EditQuestionRequest) *model.Question {
	questionUUID, _ := uuid.Parse(req.Id)
	answerUUID, _ := uuid.Parse(req.Answer.Id)
	return &model.Question{
		Id:        questionUUID,
		Content:   req.Content,
		Type:      model.QuestionType(req.Type),
		Tag:       req.Tag,
		Difficult: req.Difficult,
		Answer: &model.Answer{
			Id:      answerUUID,
			Content: req.Answer.Content,
		},
	}
}
