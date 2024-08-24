package handler

import (
	"cse-question-bank/internal/core/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type latexCompileReq struct {
	latexContent string
}

func (h *latexCompilerHandlerImpl) CompileHandler(c *gin.Context) {
	var latexCompileReq latexCompileReq
	if err := c.ShouldBindJSON(&latexCompileReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "fail to get request"})
		return
	}

	pdfFile, err := h.latexCompilerUsecase.LatexCompile(latexCompileReq.latexContent)
	if err != nil {
		response.ResponseError(c, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fail to get pdf file"})
		return
	}

	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
