package usecase

import (
	"context"
	tag_res "cse-question-bank/internal/module/tag/model/res"
)

func (t *tagUsecaseImpl) GetAllTag(ctx context.Context) ([]*tag_res.TagResponse, error) {
	tags, err := t.tagRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	tagListRes := make([]*tag_res.TagResponse, 0)
	for _, tag := range tags {
		tagListRes = append(tagListRes, tag_res.EntityToResponse(tag))
	}

	return tagListRes, nil
}
