package handler

import (
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/latex_compiler/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *latexCompilerHandlerImpl) CompileHandler(c *gin.Context) {
	var questionCompileReq model.QuestionCompile
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
