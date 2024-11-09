package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetExamFilteredQuestionsList godoc
//
// @Summary		Get exam filter questions list
// @Description	Get exam filter questions list
// @Tags			Exam
// @Accept			json
// @Param			id	path		string	true	"Exam Id"
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=[]exam_res.FilterQuestionsList}
// @Failure	400 {object} response.ErrorResponse
// @Router			/exams/{id}/get-filter-list [get]
func (h *examHandlerImpl) GetExamFilteredQuestionsList(c *gin.Context) {
	examId := c.Param("id")
	examUUID := uuid.MustParse(examId)
	res, err := h.examUsecase.GetExamFilteredQuestionsList(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
