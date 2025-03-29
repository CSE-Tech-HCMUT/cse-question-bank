package usecase

import (
	"context"
	"cse-question-bank/internal/module/question/model/req"
	res "cse-question-bank/internal/module/question/model/res"
	"strconv"

	"github.com/google/uuid"
)

func (u *questionBaseUsecaseImpl) FilterQuestion(ctx context.Context, filterCondition req.FilterQuestionRequest) ([]*res.QuestionResponse, error) {
	questionBank, err := u.repo.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	questionCount := make(map[uuid.UUID]int)

	totalTags := len(filterCondition.TagAssignments)

	for _, tagAssignment := range filterCondition.TagAssignments {
		questionsInTag, err := u.repo.FindWithTag(ctx, nil, map[string]interface{}{
			"tag_assignment.tag_id":    strconv.Itoa(tagAssignment.TagId),
			"tag_assignment.option_id": strconv.Itoa(tagAssignment.OptionId),
			"subject_id":               filterCondition.SubjectId,
		})
		if err != nil {
			return nil, err
		}

		for _, question := range questionsInTag {
			questionCount[question.Id]++
		}
	}

	filteredQuestions := questionBank[:0]
	for _, question := range questionBank {
		if questionCount[question.Id] == totalTags {
			filteredQuestions = append(filteredQuestions, question)
		}
	}

	questionsRes := make([]*res.QuestionResponse, 0)
	for _, questionEntity := range filteredQuestions {
		questionsRes = append(questionsRes, res.EntityToResponse(questionEntity, nil))
	}

	return questionsRes, nil
}

