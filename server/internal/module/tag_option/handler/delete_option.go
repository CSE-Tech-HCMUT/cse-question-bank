package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h optionHandlerImpl) DeleteOption(c *gin.Context) {
	param := c.Param("id")
	optionId, err := strconv.Atoi(param)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	err = h.optionUsecase.DeleteOption(c, optionId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", nil)
}
