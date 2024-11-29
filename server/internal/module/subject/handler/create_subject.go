package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/subject/model/req"

	"github.com/gin-gonic/gin"
)

func (h *subjectHandlerImpl) CreateSubject(c *gin.Context) {
	var request req.CreateSubjectRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.subjectUsecase.CreateSubject(c, &request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
