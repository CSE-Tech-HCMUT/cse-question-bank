package usecase

import (
	"context"
	"fmt"
)

func (u optionUsecaseImpl) DeleteOption(ctx context.Context, optionId int) error {
	questionCount, err := u.GetUsedOption(ctx, optionId)
	if err != nil {
		return err
	}

	if questionCount > 0 {
		return fmt.Errorf("oops")
	}

	err = u.optionRepository.Delete(ctx, map[string]interface{}{
		"id": optionId,
	})

	if err != nil {
		return err
	}

	return nil
}
