package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	question_res "cse-question-bank/internal/module/question/model/res"
	tag_res "cse-question-bank/internal/module/tag/model/res"
	option_res "cse-question-bank/internal/module/tag_option/model/res"
	"errors"
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
	if len(examList) == 0 {
		return nil, errors.New("exam not found")
	}
	exam := examList[0]

	existingQuestions := make(map[uuid.UUID]struct{})
	for _, question := range exam.Questions {
		existingQuestions[question.Id] = struct{}{}
	}

	filteredQuestionsList := make([]*exam_res.FilterQuestionsList, 0)
	for _, filterCondition := range exam.FilterConditions {
		tagAssignmentRes := make([]*exam_res.TagAssignment, 0)

		for _, tagAssignment := range filterCondition.FilterTagAssignments {
			questions, err := u.questionRepository.FindWithTag(ctx, nil, map[string]interface{}{
				"tag_assignment.tag_id":    strconv.Itoa(tagAssignment.TagId),
				"tag_assignment.option_id": strconv.Itoa(tagAssignment.OptionId),
				"subject_id":               exam.SubjectId,
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
					QuestionResponse: question_res.EntityToResponse(question, nil),
					IsUsed:           isUsed,
				})
			}

			tagAssignmentRes = append(tagAssignmentRes, &exam_res.TagAssignment{
				Id: tagAssignment.Id,
				Tag: tag_res.TagResponse{
					Id:          tagAssignment.TagId,
					Name:        tagAssignment.Tag.Name,
					Description: tagAssignment.Tag.Description,
				},
				Option: option_res.OptionResponse{
					Id:   tagAssignment.OptionId,
					Name: tagAssignment.Option.Name,
				},
			})

			filteredQuestionsList = append(filteredQuestionsList, &exam_res.FilterQuestionsList{
				ExpectedCount: filterCondition.ExpectedCount,
				Questions:     questionResponses,
			})

		}
	}

	return filteredQuestionsList, nil
}
