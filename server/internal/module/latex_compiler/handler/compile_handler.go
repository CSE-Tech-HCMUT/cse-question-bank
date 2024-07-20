package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type latexCompileReq struct {
	latexContent string
}

func (h *latexCompilerHandlerImpl) CompileHandler(c *gin.Context) {
	// var latexCompileReq latexCompileReq
	// if err := c.ShouldBindJSON(&latexCompileReq); err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "fail to get request"})
	// 	return
	// }

	pdfFile, err := h.latexCompilerUsecase.LatexCompile("")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fail to get pdf file"})
		return
	}

	// c.Header("Content-Disposition", "attachment; filename=output.pdf")
	c.Data(http.StatusOK, "application/pdf", pdfFile)
}
