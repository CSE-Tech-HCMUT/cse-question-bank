package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"cse-question-bank/internal/module/question/model/res"
	"strconv"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GetExamFilteredQuestionsList(ctx context.Context, examId uuid.UUID) ([]*exam_res.FilterQuestionsList, error) {
	examList, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if err != nil {
		return nil, err
	}

	exam := examList[0]

	existingQuestions := make(map[uuid.UUID]struct{})
	for _, filterCondition := range exam.FilterConditions {
		for _, question := range filterCondition.Questions {
			existingQuestions[question.Id] = struct{}{}
		}
	}

	filteredQuestionsList := make([]*exam_res.FilterQuestionsList, 0)
	for _, filterCondition := range exam.FilterConditions {
		for _, tagAssignment := range filterCondition.FilterTagAssignments {
			questions, err := u.questionRepository.Find(ctx, nil, map[string]interface{}{
				"tag_assignment.tag_id":    strconv.Itoa(tagAssignment.TagId),
				"tag_assignment.option_id": strconv.Itoa(tagAssignment.OptionId),
			})
			if err != nil {
				return nil, err
			}
			questionResponses := make([]*exam_res.QuestionFilterExam, 0)
			for _, question := range questions {
				isUsed := false
				if _, exists := existingQuestions[question.Id]; exists {
					isUsed = true
				}

				questionResponses = append(questionResponses, &exam_res.QuestionFilterExam{
					QuestionResponse: res.EntityToResponse(question, nil),
					IsUsed:           isUsed,
				})
			}

			filteredQuestionsList = append(filteredQuestionsList, &exam_res.FilterQuestionsList{
				ExpectedCount: filterCondition.ExpectedCount,
				Questions:     questionResponses,
			})

		}
	}

	return filteredQuestionsList, nil
}
