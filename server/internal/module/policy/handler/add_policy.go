package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/policy/model/req"

	"github.com/gin-gonic/gin"
)

func (h *policyHandlerImpl) AddPolicy(c *gin.Context) {
	var request req.AddPolicyRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	if err := h.policyUsecase.AddPolicy(c, &request); err != nil {
		response.ResponseError(c, err)
		return
	}

	return
}
