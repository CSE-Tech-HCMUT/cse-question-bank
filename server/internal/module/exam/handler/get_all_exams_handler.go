package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

// GetAllExams godoc
//
// @Summary		Show all exams
// @Description	Show all exams
// @Tags			Exam
// @Accept			json
// @Produce		json
// @Success		200	{object} response.SuccessResponse{data=[]exam_res.ExamResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/exams [get]
func (h *examHandlerImpl) GetAllExams(c *gin.Context) {
	examListRes, err := h.examUsecase.GetAllExams(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", examListRes)
}
