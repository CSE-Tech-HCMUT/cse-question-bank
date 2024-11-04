package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CompileHandler godoc
//
// @Summary      Compile Latex to PDF
// @Description  Compile Latex to PDF
// @Tags         Latex Compile
// @Accept       json
// @Produce      application/pdf
// @Param        QuestionCompileRequest  body      req.QuestionCompileRequest  true  "QuestionCompileRequest JSON"
// @Success      200  {file}  file
// @Failure      400  {object}  response.ErrorResponse
// @Router       /latex-compile [post]
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
