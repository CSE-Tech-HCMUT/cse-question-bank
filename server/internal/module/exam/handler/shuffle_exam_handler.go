package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/exam/model/req"

	"github.com/gin-gonic/gin"
)

// ShuffleExam godoc
//
// @Summary		Get all clone exams root exams, then shuffle question inside
// @Description	Get all clone exams root exams, then shuffle question inside
// @Tags			Exam
// @Accept			json
// @Produce		json
// @Param			ShuffleExamReq	body		req.ShuffleExamReq	true	"ShuffleExamReq JSON"
// @Success		200	{object} response.SuccessResponse{data=[]exam_res.ExamResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/exams/shuffle [post]
func (h *examHandlerImpl) ShuffleExam(c *gin.Context) {
	var request req.ShuffleExamReq
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	examListRes, err := h.examUsecase.ShuffleExam(c, request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", examListRes)
}
