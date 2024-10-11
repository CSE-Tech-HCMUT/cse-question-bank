package usecase

import "context"

func (u optionUsecaseImpl) GetUsedOption(ctx context.Context, optionId int) (int, error) {
	tagAssignmentList, err := u.tagAssignmentRepository.Find(ctx, map[string]interface{}{
		"option_id": optionId,
	})

	if err != nil {
		return -1, err
	}

	return len(tagAssignmentList), nil
}
