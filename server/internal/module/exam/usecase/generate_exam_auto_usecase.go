package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GenerateExamAuto(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	// // call tag usecase to verify filtertag.
	// exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
	// 	"id": examId,
	// })
	// if err != nil {
	// 	return nil, err
	// }

	// exam := exams[0]
	// checkQuestion := make(map[uuid.UUID]struct{})
	// for _, filterCondition := range exam.FilterConditions {
	// 	for _, question := range filterCondition.Questions {
	// 		// TODO: convert all uuid to string or string to uuid
	// 		checkQuestion[question.Id] = struct{}{}
	// 	}
	// }
	// // call question usecase to get question by filtertag => handle it with groutine?
	// // questionsLists, err := u.GetExamFilteredQuestionsList(ctx, examId)
	// // if err != nil {
	// // 	return nil, err
	// // }

	// for _, filterCondition := range exam.FilterConditions {
	// 	currentCount := len(filterCondition.Questions)
	// 	if currentCount >= filterCondition.ExpectedCount {
	// 		continue
	// 	}

	// 	for _, tagAssignment := range filterCondition.FilterTagAssignments {
	// 		questions, err := u.questionRepository.FindWithTag(ctx, nil, map[string]interface{}{
	// 			"tag_assignment.tag_id":    strconv.Itoa(tagAssignment.TagId),
	// 			"tag_assignment.option_id": strconv.Itoa(tagAssignment.OptionId),
	// 			"subject_id":               exam.SubjectId,
	// 		})
	// 		if err != nil {
	// 			return nil, err
	// 		}

	// 		rand.Shuffle(len(questions), func(i, j int) {
	// 			questions[i], questions[j] = questions[j], questions[i]
	// 		})

	// 		for _, question := range questions {
	// 			if currentCount >= filterCondition.ExpectedCount {
	// 				break
	// 			}

	// 			if _, exists := checkQuestion[question.Id]; exists {
	// 				continue
	// 			}

	// 			filterCondition.Questions = append(filterCondition.Questions, question)
	// 			checkQuestion[question.Id] = struct{}{}
	// 			currentCount++
	// 		}
	// 	}
	// }

	// if len(checkQuestion) < exam.TotalQuestion {
	// 	var otherFilterCondition entity.FilterCondition

	// 	excludedIDs := make([]string, 0, len(checkQuestion))
	// 	for id := range checkQuestion {
	// 		excludedIDs = append(excludedIDs, id.String())
	// 	}

	// 	randomQuestions, err := u.questionRepository.Find(ctx, nil, map[string]interface{}{
	// 		"subject_id": exam.SubjectId,
	// 	})
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	rand.Shuffle(len(randomQuestions), func(i, j int) {
	// 		randomQuestions[i], randomQuestions[j] = randomQuestions[j], randomQuestions[i]
	// 	})

	// 	for _, question := range randomQuestions {
	// 		if len(checkQuestion) >= exam.TotalQuestion {
	// 			break
	// 		}
	// 		if _, exists := checkQuestion[question.Id]; exists {
	// 			continue
	// 		}
	// 		checkQuestion[question.Id] = struct{}{}
	// 		otherFilterCondition.Questions = append(otherFilterCondition.Questions, question)
	// 		checkQuestion[question.Id] = struct{}{}
	// 		otherFilterCondition.ExpectedCount++
	// 	}

	// 	exam.FilterConditions = append(exam.FilterConditions, &otherFilterCondition)
	// }

	// err = u.examRepostiroy.Update(ctx, nil, exam)
	// if err != nil {
	// 	return nil, err
	// }

	// // TODO: rollbakc

	// return exam_res.EntityToResponse(exam), nil
	return nil, nil
}

// func (u *examUsecaseImpl) verifyFilterTags(
// 	ctx context.Context,
// 	filterTag []*entity.FilterTag,
// 	subject string,
// 	numberQuestions int,
// ) error {
// 	tagSubjects, err := u.tagRepository.Find(ctx, nil, map[string]interface{}{
// 		"subject": subject,
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	tagDictionary := make(map[int][]int, 0)
// 	for _, tagSubject := range tagSubjects {
// 		tagDictionary[tagSubject.Id] = make([]int, 0)

// 		for _, optionTag := range tagSubject.Options {
// 			tagDictionary[tagSubject.Id] = append(tagDictionary[tagSubject.Id], optionTag.Id)
// 		}
// 	}

// 	for _, tagVerify := range filterTag {
// 		value, ok := tagDictionary[tagVerify.TagId]
// 		if !ok {
// 			return errors.New("tag not belong to subject")
// 		}

// 		if !slices.Contains(value, tagVerify.OptionId) {
// 			return errors.New("option not belong to tag")
// 		}

// 		numberQuestions -= tagVerify.NumberQuestions
// 		if numberQuestions < 0 {
// 			return errors.New("oops")
// 		}
// 	}

// 	// Should we check it, or allow user to create exam with not full settings?
// 	// If allow, for case generate exam auto -> get random question.
// 	if numberQuestions < 0 {
// 		return errors.New("check number question")
// 	}

// 	return nil
// }
