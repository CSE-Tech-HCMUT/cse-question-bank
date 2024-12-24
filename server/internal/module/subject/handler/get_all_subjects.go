package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

//	GetAllSubects godoc
//
//	@Summary		Show all subjects
//	@Description	Show all subjects
//	@Tags			Subject
//	@Accept			json
//	@Produce		json
//	@Success		200	{object} response.SuccessResponse{data=[]subject_res.SubjectResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/subjects [get]
func (h *subjectHandlerImpl) GetAllSubjects(c *gin.Context) {
	res, err := h.subjectUsecase.GetAllSubjects(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", res)
}