package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CompileQuestion godoc
//
// @Summary		Get question pdf preview
// @Description	Get question pdf preview
// @Tags			 Latex Compile
// @Accept			jsons
// @Param			id	path		string	true	"Question Id"
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=interface{}}
// @Failure	400 {object} response.ErrorResponse
// @Router			compile-latex/exams/{id} [get]
func (h *latexCompilerHandlerImpl) CompileQuestion(c *gin.Context) {
	questionId := c.Param("id")
	questionUUID, err := uuid.Parse(questionId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
	}

	pdfFile, err := h.latexCompilerUsecase.CompileQuestionLatex(c, questionUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
