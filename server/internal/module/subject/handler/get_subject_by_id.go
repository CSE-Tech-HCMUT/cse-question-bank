package handler

import (
	"cse-question-bank/internal/core/errors"
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetSubjectById godoc
//
// @Summary		Get subject by id
// @Description	Get subject by id
// @Tags			Subject
// @Accept			json
// @Produce		json
// @Param			id	path		string	true	"Subject Id"
// @Success		200	{object} response.SuccessResponse{data=[]subject_res.SubjectResponse}
// @Failure	400 {object} response.ErrorResponse
// @Router			/subjects/{id} [get]
func (h *subjectHandlerImpl) GetSubjectById(c *gin.Context) {
	paramId := c.Param("id")
	subjectId, err := uuid.Parse(paramId)
	if err != nil {
		response.ResponseError(c, errors.ErrInvalidInput(err))
		return
	}

	res, err := h.subjectUsecase.GetSubjectById(c, subjectId)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}
