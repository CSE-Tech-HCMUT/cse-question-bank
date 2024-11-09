package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GenerateExamAuto godoc
//
// @Summary		Generate exam auto
// @Description	Generate exam auto
// @Tags			Exam
// @Accept			json
//	@Param			id	path		string	true	"Exam Id"
// @Produce		json
// @Success		200	{object}	response.SuccessResponse{data=[]exam_res.ExamResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/exams/{id}/generate-auto [post]
func (h *examHandlerImpl) GenerateExamAuto(c *gin.Context) {
	examId := c.Param("id")
	examUUID := uuid.MustParse(examId)
	res, err := h.examUsecase.GenerateExamAuto(c, examUUID)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
