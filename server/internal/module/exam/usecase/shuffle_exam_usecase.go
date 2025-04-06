package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"encoding/json"
	"math/rand/v2"
)

type MultipleChoiceAnswer struct {
	Content   string `json:"content"`
	IsCorrect bool   `json:"isCorrect"`
}

func (u *examUsecaseImpl) ShuffleExam(ctx context.Context, request req.ShuffleExamReq) ([]*exam_res.ExamResponse, error) {
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": request.ExamId,
	})
	if err != nil {
		return nil, err
	}

	exam := exams[0]
	var responses []*exam_res.ExamResponse

	for i := 1; i <= request.NumberExams; i++ {
		// Clone original questions
		shuffledQuestions := make([]*entity.Question, len(exam.Questions))
		for idx, q := range exam.Questions {
			// Deep clone question
			cloned := *q

			if request.IsShuffleInsideQuestions && cloned.CanShuffle && cloned.Answer != nil {
				var options []MultipleChoiceAnswer
				err := json.Unmarshal([]byte(cloned.Answer.Content), &options)
				if err == nil {
					// shuffle answer
					rand.Shuffle(len(options), func(i, j int) {
						options[i], options[j] = options[j], options[i]
					})

					// assigne to clone answer
					shuffledContent, _ := json.Marshal(options)
					cloned.Answer.Content = shuffledContent
				}
			}

			shuffledQuestions[idx] = &cloned
		}

		// Shuffle questions
		rand.Shuffle(len(shuffledQuestions), func(i, j int) {
			shuffledQuestions[i], shuffledQuestions[j] = shuffledQuestions[j], shuffledQuestions[i]
		})

		newCode := exam.Code + i

		newExam := &entity.Exam{
			Semester:         exam.Semester,
			SubjectId:        exam.SubjectId,
			TotalQuestion:    exam.TotalQuestion,
			FilterConditions: exam.FilterConditions,
			Questions:        shuffledQuestions,
			Code:             newCode,
		}

		err := u.examRepostiroy.Create(ctx, nil, newExam)
		if err != nil {
			return nil, err
		}

		res := exam_res.EntityToResponse(newExam)
		responses = append(responses, res)
	}

	return responses, nil
}
