package handler

import "github.com/gin-gonic/gin"

func (h *questionHandlerImpl) GetQuestionByFilter(c *gin.Context) {
	// TODO:
	// parse from url - example: api/questions/list?filter=difficult=hard%topic=search
	// put it to req.QuestionFilter
	// call usecase GetQuestionByFilter
}
