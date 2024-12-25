package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CompileExam godoc
//
// @Summary		Get exam pdf preview
// @Description	Get exam pdf preview
// @Tags			 Latex Compile
// @Accept			jsons
// @Param			id	path		string	true	"Exam Id"
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=interface{}}
// @Failure	400 {object} response.ErrorResponse
// @Router			compile-latex/exams/{id} [get]
func (h *latexCompilerHandlerImpl) CompileExam(c *gin.Context) {
	examId := c.Param("id")
	examUUID, err := uuid.Parse(examId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
	}

	pdfFile, err := h.latexCompilerUsecase.CompileExamLatex(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
