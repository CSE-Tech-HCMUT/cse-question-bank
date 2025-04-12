package casbin

import (
	"cse-question-bank/internal/core/errors"

	"github.com/gin-gonic/gin"
)

func AddPolicy(c *gin.Context,sub, object, act string) error {
	casbinService, exists := c.Get("casbinService")
	if !exists {
		return errors.ErrUnauthorized()
	}

	casbinServiceInstance, ok := casbinService.(*CasbinService)
	if !ok {
		return errors.ErrUnauthorized()
	}

	success, err := casbinServiceInstance.AddPolicy(sub, object, act)
	if err != nil {
		return err
	}

	if !success {
		return errors.ErrInvalidInput(nil)
	}

	return nil
}
