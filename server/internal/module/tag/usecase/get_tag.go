package usecase

import (
	"context"
	tag_res "cse-question-bank/internal/module/tag/model/res"
)

func (t *tagUsecaseImpl) GetTag(ctx context.Context, tagId int) (*tag_res.TagResponse, error) {
	tags, err := t.tagRepository.Find(ctx, nil, map[string]interface{}{
		"id": tagId,
	})
	if err != nil {
		return nil, nil
	}

	tagRes := tag_res.EntityToResponse(tags[0])

	return tagRes, nil
}
