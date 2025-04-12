package casbin

import (
	"cse-question-bank/internal/core/errors"

	"github.com/gin-gonic/gin"
)

func RemovePolicyByObject(c *gin.Context, object string) error {
	casbinService, exists := c.Get("casbinService")
	if !exists {
		return errors.ErrUnauthorized()
	}

	casbinServiceInstance, ok := casbinService.(*CasbinService)
	if !ok {
		return errors.ErrUnauthorized()
	}

	success, err := casbinServiceInstance.RemovePolicyByObject(object)
	if err != nil {
		return err
	}

	if !success {
		return errors.ErrInvalidInput(nil)
	}

	return nil
}
