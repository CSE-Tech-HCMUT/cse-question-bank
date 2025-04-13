package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"encoding/json"
	"log/slog"
	"math/rand/v2"

	"github.com/google/uuid"
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
			// Clone question
			clonedId := uuid.New()
			cloned := &entity.Question{
				Id:             clonedId,
				IsParent:       q.IsParent,
				CanShuffle:     q.CanShuffle,
				ParentId:       q.ParentId,
				Type:           q.Type,
				Difficult:      q.Difficult,
				SubjectId:      q.SubjectId,
				Subject:        q.Subject,
				Content:        q.Content,
				TagAssignments: q.TagAssignments,
			}

			clonedAnswer := &entity.Answer{
				Content:    q.Answer.Content,
				QuestionId: clonedId,
			}

			if request.IsShuffleInsideQuestions && cloned.CanShuffle && clonedAnswer.Content != nil {
				var options []MultipleChoiceAnswer
				err := json.Unmarshal([]byte(clonedAnswer.Content), &options)
				if err == nil {
					// Shuffle answer
					rand.Shuffle(len(options), func(i, j int) {
						options[i], options[j] = options[j], options[i]
					})

					// Assign to cloned answer
					shuffledContent, _ := json.Marshal(options)
					clonedAnswer.Content = shuffledContent
				}
			}

			cloned.Answer = clonedAnswer

			if err := u.questionRepository.Create(ctx, nil, cloned); err != nil {
				slog.Error("Failed to create question in database", "error-message", err)
				return nil, err
			}

			shuffledQuestions[idx] = cloned
		}

		// Shuffle questions
		rand.Shuffle(len(shuffledQuestions), func(i, j int) {
			shuffledQuestions[i], shuffledQuestions[j] = shuffledQuestions[j], shuffledQuestions[i]
		})

		newCode := exam.Code + i

		// Create a new exam with a reference to the parent exam
		newExam := &entity.Exam{
			Semester:         exam.Semester,
			SubjectId:        exam.SubjectId,
			TotalQuestion:    exam.TotalQuestion,
			FilterConditions: exam.FilterConditions,
			Questions:        shuffledQuestions,
			Code:             newCode,
			ParentExamId:     &exam.Id, // Reference to the parent exam
		}

		err := u.examRepostiroy.Create(ctx, nil, newExam)
		if err != nil {
			slog.Error("Failed to create exam in database", "error-message", err)
			return nil, err
		}

		// Convert the new exam to a response
		res := exam_res.EntityToResponse(newExam)
		responses = append(responses, res)
	}

	return responses, nil
}
