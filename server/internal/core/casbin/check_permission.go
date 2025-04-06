package casbin

import (
	"cse-question-bank/internal/core/errors"

	"github.com/gin-gonic/gin"
)

func CasbinCheckPermission(c *gin.Context, object, act string) error {
	// userId, exist := c.Get("userId")
	// if !exist {
	// 	return errors.ErrUnauthorized()
	// }

	// userUUID, ok := userId.(*uuid.UUID)
	// if !ok {
	// 	return errors.ErrUnauthorized()
	// }

	userId := "5b00bff2-5169-46ce-8075-762fac0a9c7b"

	casbinService, exists := c.Get("casbinService")
	if !exists {
		return errors.ErrUnauthorized()
	}

	casbinServiceInstance, ok := casbinService.(*CasbinService)
	if !ok {
		return errors.ErrUnauthorized()
	}

	allowed, err := casbinServiceInstance.Enforce(userId, object, act)
	if err != nil {
		return err
	}

	if !allowed {
		return errors.ErrUnauthorized()
	}

	return nil
}
