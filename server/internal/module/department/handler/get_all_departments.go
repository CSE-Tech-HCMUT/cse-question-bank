package handler

import (
	"cse-question-bank/internal/core/response"

	"github.com/gin-gonic/gin"
)

//	GetAllDepartment godoc
//
//	@Summary		Show all departments
//	@Description	Show all departments
//	@Tags			Department
//	@Accept			json
//	@Produce		json
//	@Success		200	{object} response.SuccessResponse{data=[]department_res.DepartmentResponse}
//	@Failure	400 {object} response.ErrorResponse
//	@Router			/departments [get]
func (h *departmentHandlerImpl) GetAllDepartments(c *gin.Context) {
	departmentResList, err := h.departmentUsecase.GetAllDepartments(c)
	if err != nil {
		response.ResponseError(c, err)
		return
	}

	response.ReponseSuccess(c, "ok", departmentResList)
}