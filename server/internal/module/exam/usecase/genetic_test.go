package usecase_test

import (
	"cse-question-bank/internal/module/exam/usecase"
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// Generate random question bank
func generateQuestionBank(numQuestions, numTags, numOptions int) []*usecase.Question {
	questionBank := make([]*usecase.Question, numQuestions)

	for i := 0; i < numQuestions; i++ {
		tagAssignments := make([]usecase.TagAssignment, numTags+1)
		for j := 1; j <= numTags; j++ {
			tagAssignments[j] = usecase.TagAssignment{
				TagId:    j,
				OptionId: rand.Intn(numOptions) + 1,
			}
		}
		questionBank[i] = &usecase.Question{
			Id:             uuid.New(),
			TagAssignments: tagAssignments,
			FitnessScore:   rand.Float64(),
		}
	}
	return questionBank
}

// Compare function to verify the result
func compareWithFilterConditions(selected []*usecase.Question, filters []*usecase.FilterCondition) bool {
	tagCount := make(map[int]int)
	optionCount := make(map[int]int)

	for _, q := range selected {
		for _, tag := range q.TagAssignments {
			tagCount[tag.TagId]++
			optionCount[tag.OptionId]++
		}
	}

	totalExpected := 0
	for _, filter := range filters {
		totalExpected += filter.ExpectedCount
		for _, filterTag := range filter.FilterTagAssignments {
			if count, exists := tagCount[filterTag.TagId]; !exists || count == 0 {
				return false
			}
			if count, exists := optionCount[filterTag.OptionId]; !exists || count == 0 {
				return false
			}
		}
	}

	return len(selected) == totalExpected
}

func countQuestionsByFilter(questionBank []*usecase.Question, filterConditions []*usecase.FilterCondition) {
	for _, filter := range filterConditions {
		count := 0
		for _, question := range questionBank {
			if matchesFilter(question, filter.FilterTagAssignments) {
				count++
			}
		}
		fmt.Printf("Tags: %v -> Found: %d / Expected: %d\n", filter.FilterTagAssignments, count, filter.ExpectedCount)
	}
}

func matchesFilter(question *usecase.Question, filterTags []usecase.TagAssignment) bool {
	tagMap := make(map[string]bool)

	// Đưa tất cả các tag của câu hỏi vào map để tra cứu nhanh
	for _, tag := range question.TagAssignments {
		key := fmt.Sprintf("%d-%d", tag.TagId, tag.OptionId)
		tagMap[key] = true
	}

	// Kiểm tra xem tất cả tag trong filter có tồn tại trong câu hỏi không
	for _, filterTag := range filterTags {
		key := fmt.Sprintf("%d-%d", filterTag.TagId, filterTag.OptionId)
		if !tagMap[key] {
			return false
		}
	}
	return true
}

// Test Genetic Algorithm with list of filters
func TestGeneticAlgorithm(t *testing.T) {
	rand.Seed(time.Now().UnixNano()) // Set seed once
	sizes := []int{50, 100, 150, 200, 500}
	tagsOptions := [][]int{{2, 3}}

	filterConditions := []*usecase.FilterCondition{
		{
			FilterTagAssignments: []usecase.TagAssignment{
				{TagId: 1, OptionId: 1},
				{TagId: 2, OptionId: 1},
			},
			ExpectedCount: 10,
		},
		{
			FilterTagAssignments: []usecase.TagAssignment{
				{TagId: 1, OptionId: 2},
				{TagId: 2, OptionId: 2},
			},
			ExpectedCount: 10,
		},
		{
			FilterTagAssignments: []usecase.TagAssignment{
				{TagId: 1, OptionId: 2},
				{TagId: 2, OptionId: 3},
			},
			ExpectedCount: 5,
		},
		{
			FilterTagAssignments: []usecase.TagAssignment{
				{TagId: 1, OptionId: 1},
				{TagId: 2, OptionId: 3},
			},
			ExpectedCount: 5,
		},
		{
			FilterTagAssignments: []usecase.TagAssignment{
				{TagId: 1, OptionId: 3},
				{TagId: 2, OptionId: 1},
			},
			ExpectedCount: 5,
		},
	}

	for _, size := range sizes {
		for _, to := range tagsOptions {
			numTags, numOptions := to[0], to[1]
			t.Run(fmt.Sprintf("Size_%d_Tags_%d_Options_%d", size, numTags, numOptions), func(t *testing.T) {
				questionBank := generateQuestionBank(size, numTags, numOptions)
				countQuestionsByFilter(questionBank, filterConditions)
				// Run Genetic Algorithm
				exam := usecase.GeneticAlgorithm(questionBank, filterConditions, 20, 20)

				// Sử dụng map để tra cứu nhanh hơn
				questionMap := make(map[uuid.UUID]*usecase.Question)
				for _, q := range questionBank {
					questionMap[q.Id] = q
				}

				selectedQuestions := make([]*usecase.Question, 0, len(exam.QuestionList))
				for _, qId := range exam.QuestionList {
					if q, exists := questionMap[qId]; exists {
						selectedQuestions = append(selectedQuestions, q)
					}
				}

				// Validate result
				assert.Equal(t, 35, len(selectedQuestions), "Should return the expected number of questions")
				assert.True(t, compareWithFilterConditions(selectedQuestions, filterConditions), "Result should match filter conditions")
			})
		}
	}
}
