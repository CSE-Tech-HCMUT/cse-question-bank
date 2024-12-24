package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"
	"cse-question-bank/internal/module/subject/model/req"

	"github.com/gin-gonic/gin"
)

//	CreateSubject godoc
//
//	@Summary		Create a subject
//	@Description	Create a subject
//	@Tags			Subject
//	@Accept			json
//	@Produce		json
//	@Param			CreateSubjectRequest	body		req.CreateSubjectRequest	true	"CreateSubjectRequest JSON"
//	@Success		200	{object}	response.SuccessResponse{data=subject_res.SubjectResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/tags [post]
func (h *subjectHandlerImpl) CreateSubject(c *gin.Context) {
	var request req.CreateSubjectRequest
	if err := c.ShouldBind(&request); err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.subjectUsecase.CreateSubject(c, &request)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
