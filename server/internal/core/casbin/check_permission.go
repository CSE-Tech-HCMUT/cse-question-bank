package casbin

import (
	"cse-question-bank/internal/core/errors"

	"github.com/gin-gonic/gin"
)

func CasbinCheckPermission(c *gin.Context, object, act string) error {
	userId, exist := c.Get("userId")
	if !exist {
		return errors.ErrUnauthorized()
	}

	// Assert userId to string
	userIdStr, ok := userId.(string)
	if !ok {
		return errors.ErrUnauthorized()
	}

	casbinService, exists := c.Get("casbinService")
	if !exists {
		return errors.ErrUnauthorized()
	}

	casbinServiceInstance, ok := casbinService.(*CasbinService)
	if !ok {
		return errors.ErrUnauthorized()
	}

	allowed, err := casbinServiceInstance.Enforce(userIdStr, object, act)
	if err != nil {
		return err
	}

	if !allowed {
		return errors.ErrUnauthorized()
	}

	return nil
}
