package handler

import (
	"cse-question-bank/internal/core/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type latexCompileReq struct {
	latexContent string `json:"latex-content"`
}

func (h *latexCompilerHandlerImpl) CompileHandler(c *gin.Context) {
	// var latexCompileReq latexCompileReq
	// if err := c.ShouldBindJSON(&latexCompileReq); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "fail to get request"})
	// 	return
	// }

	pdfFile, err := h.latexCompilerUsecase.LatexCompile("")
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
