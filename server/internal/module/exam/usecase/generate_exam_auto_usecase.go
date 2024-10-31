package usecase

import (
	"context"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"math/rand"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GenerateExamAuto(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	// call tag usecase to verify filtertag.
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if err != nil {
		return nil, err
	}

	exam := exams[0]
	checkQuestion := make(map[string]struct{})
	for _, question := range exam.Questions {
		// TODO: convert all uuid to string or string to uuid
		checkQuestion[question.Id.String()] = struct{}{}
	}
	// call question usecase to get question by filtertag => handle it with groutine?
	questionsLists, err := u.GetExamFilteredQuestionsList(ctx, examId)
	if err != nil {
		return nil, err
	}

	for _, questionsList := range questionsLists {
		i := 0
		len := len(questionsLists)
		for i < questionsList.NumberQuestions {
			randomIndex := rand.Intn(len)

			questionId := questionsList.Questions[randomIndex].Id
			if _, exists := checkQuestion[questionId]; exists {
				continue
			}

			questionEntity, err := u.questionRepository.Find(ctx, nil, map[string]interface{}{
				"id": questionId,
			})
			if err != nil {
				return nil, err
			}

			exam.Questions = append(exam.Questions, questionEntity[0])

			i++
		}
	}

	err = u.examRepostiroy.Update(ctx, nil, exam)
	if err != nil {
		return nil, err
	}

	// TODO: rollbakc

	return exam_res.EntityToResponse(exam), nil
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
