package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	"cse-question-bank/internal/module/exam/model/req"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"errors"
	"log/slog"
	"math/rand/v2"
)

type MultipleChoiceAnswer struct {
	Content   string `json:"content"`
	IsCorrect bool   `json:"isCorrect"`
}

func (u *examUsecaseImpl) ShuffleExam(ctx context.Context, request req.ShuffleExamReq) ([]*exam_res.ExamResponse, error) {
	// Validate the request
	if request.NumberExams <= 0 {
		return nil, errors.New("count must be greater than zero")
	}

	// Find the exam by ID
	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": request.ExamId,
	})
	if err != nil {
		return nil, err
	}

	if len(exams) == 0 {
		slog.Error("Exam not found", "error-message", "exam not found")
		return nil, errors.New("exam not found")
	}

	exam := exams[0]

	// Check if the exam has questions
	if len(exam.Questions) == 0 {
		return nil, errors.New("no questions in the template exam to shuffle")
	}

	for i := 1; i <= request.NumberExams; i++ {
		// Clone original questions
		shuffledQuestions := make([]*entity.Question, len(exam.Questions))
		copy(shuffledQuestions, exam.Questions) // Just copy references for the test

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

		// Create the new exam
		err := u.examRepostiroy.Create(ctx, nil, newExam)
		if err != nil {
			slog.Error("Failed to create exam in database", "error-message", err)
			return nil, err
		}
	}

	// Fetch all shuffled exams for this parent
	shuffledExams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"parent_exam_id": exam.Id,
	})
	if err != nil {
		return nil, err
	}

	// Convert the exams to responses
	responses := make([]*exam_res.ExamResponse, len(shuffledExams))
	for i, shuffledExam := range shuffledExams {
		responses[i] = exam_res.EntityToResponse(shuffledExam)
	}

	return responses, nil
}
