package handler

import (
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/subject/model/req"

	"github.com/gin-gonic/gin"
)

func (h *subjectHandlerImpl) UpdateSubject(c *gin.Context) {
	var request req.UpdateSubjectRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, err)
		return
	}

	res, err := h.subjectUsecase.UpdateSubject(c, &request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}