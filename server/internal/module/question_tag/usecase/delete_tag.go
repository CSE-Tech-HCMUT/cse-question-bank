package usecase

import "context"

func (t *tagUsecaseImpl) DeleteTag(ctx context.Context, tagId int) error {
	err := t.tagRepository.Delete(ctx, nil, map[string]interface{}{
		"id": tagId,
	})
	
	if err != nil {
		return err
	}

	return nil
}