package handler

import (
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/latex_compiler/model/req"
	"net/http"

	"github.com/gin-gonic/gin"
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
func (h *latexCompilerHandlerImpl) CompileHandler(c *gin.Context) {
	var questionCompileReq req.QuestionCompileRequest
	if err := c.ShouldBindJSON(&questionCompileReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "fail to get request"})
		return
	}

	pdfFile, err := h.latexCompilerUsecase.LatexCompile(&questionCompileReq)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
