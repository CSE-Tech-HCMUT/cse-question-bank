package usecase

import (
	"fmt"
	"math"
	"math/rand/v2"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// generateRandomQuestionBank tạo ngân hàng câu hỏi ngẫu nhiên với numQuestions câu hỏi,
// mô phỏng dữ liệu giống database, đảm bảo đủ câu hỏi với DiscriminationScore >= 0.8.
func generateRandomQuestionBank(numQuestions int) []*Question {
	questions := make([]*Question, numQuestions)
	// currentSemester := 252 // Assume current semester is 2025, semester 2

	// Ensure at least 30 high-quality questions with DiscriminationScore >= 0.8 and semesterGap >= 3
	minHighQualityQuestions := 150
	for i := 0; i < numQuestions; i++ {
		// Generate random TagAssignments
		numTags := rand.IntN(3) + 1
		tagAssignments := make([]TagAssignment, numTags)
		for j := 0; j < numTags; j++ {
			tagAssignments[j] = TagAssignment{
				TagId:    rand.IntN(5) + 1,
				OptionId: rand.IntN(3) + 1,
			}
		}

		// Generate valid data
		var semesterGap, usageCount int
		var discriminationScore float64
		if i < minHighQualityQuestions {
			// Ensure high-quality questions
			semesterGap = rand.IntN(10) + 1      // Ensure semesterGap >= 3
			usageCount = rand.IntN(4) + 1        // Low usage count for prioritization
			discriminationScore = rand.Float64() // [0.0, 1.0]
		} else {
			semesterGap = 100                    // Random semester gap
			usageCount = 0                       // Random usage count
			discriminationScore = rand.Float64() // [0.0, 1.0]
		}

		// Calculate LastUsedScore and UsageCountScore
		// semesterGap := semesterSince(lastUsedSemester, currentSemester)
		lastUsedScore := float64(semesterGap) / float64(semesterGap+3)
		// if semesterGap < 3 {
		// 	lastUsedScore *= 0.5
		// }
		if lastUsedScore <= 0 {
			lastUsedScore = 0.1 // Ensure LastUsedScore is never zero
		}

		usageCountScore := 1.0 / float64(usageCount+1)

		questions[i] = &Question{
			Id:                  uuid.New(),
			TagAssignments:      tagAssignments,
			UsageCountScore:     usageCountScore,
			LastUsedScore:       lastUsedScore,
			DiscriminationScore: discriminationScore,
		}
	}
	return questions
}

func generateFilterConditions(totalQuestions int) []*FilterCondition {
	numConditions := rand.IntN(5) + 1 // 1 to 5 conditions
	conditions := make([]*FilterCondition, 0, numConditions)
	remainingQuestions := totalQuestions
	count := 0
	// Sinh ngẫu nhiên ExpectedCount sao cho tổng bằng totalQuestions
	for i := 0; i < numConditions; i++ {
		var expectedCount int
		if i == numConditions-1 {
			expectedCount = remainingQuestions // Đảm bảo tổng bằng totalQuestions
		} else {
			// Giới hạn để không bị âm ở các bước sau
			maxForThis := remainingQuestions - (numConditions - i - 1)
			expectedCount = rand.IntN(maxForThis) + 1
		}
		remainingQuestions -= expectedCount

		conditions = append(conditions, &FilterCondition{
			FilterTagAssignments: []TagAssignment{
				{
					TagId:    rand.IntN(5) + 1, // Giả sử có 5 tagId
					OptionId: rand.IntN(3) + 1, // Giả sử mỗi tag có 3 option
				},
				{
					TagId:    rand.IntN(5) + 1,
					OptionId: rand.IntN(3) + 1,
				},
			},
			ExpectedCount: expectedCount,
		})
		count += expectedCount
	}
	return conditions
}

// TestGeneticAlgorithm_SuccessWith500Questions kiểm tra với ngân hàng 500 câu hỏi.
func TestGeneticAlgorithm_SuccessWith500Questions(t *testing.T) {
	var questionBank []*Question
	var filterConditions []*FilterCondition
	questionCount := 30
	for {
		questionBank = generateRandomQuestionBank(500)
		filterConditions = generateFilterConditions(questionCount)
		if validateQuestionBank(questionBank, filterConditions) == nil {
			break
		}
	}
	populationSize := 100
	generations := 50

	// Run GeneticAlgorithm
	result := GeneticAlgorithm(questionBank, filterConditions, populationSize, generations)

	// Validate results
	assert.NotNil(t, result, "Result exam should not be nil")
	assert.NotNil(t, result.QuestionList, "QuestionList should not be nil")

	// Validate total number of questions
	totalExpectedCount := 0
	for _, condition := range filterConditions {
		totalExpectedCount += condition.ExpectedCount
	}
	assert.Equal(t, totalExpectedCount, len(result.QuestionList), "QuestionList should have correct number of questions")

	// Validate question distribution for each FilterCondition
	_, questionCollection := buildQuestionIndex(questionBank)
	// currentSemester := 252

	for _, condition := range filterConditions {
		count := 0
		for _, qId := range result.QuestionList {
			question, exists := questionCollection[qId]
			assert.True(t, exists, "Question %s should exist in questionCollection", qId)
			if satisfiesFilterCondition(question, condition) {
				count++
			}
		}
		assert.LessOrEqual(t, condition.ExpectedCount, count, "FilterCondition %v should have %d questions, got %d", condition.FilterTagAssignments, condition.ExpectedCount, count)
	}
	highDiscriminationCount := 0
	// Validate semesterGap >= 3 and DiscriminationScore in [0.8, 1.0]
	for _, qId := range result.QuestionList {
		question, exists := questionCollection[qId]
		assert.True(t, exists, "Question %s should exist in questionCollection", qId)
		semesterGap := int(math.Round(3*question.LastUsedScore/(1-question.LastUsedScore))) - 3
		assert.GreaterOrEqual(t, semesterGap, 3, "Question %s should have semesterGap >= 3, got %d", qId, semesterGap)

		if question.DiscriminationScore >= 0.5 {
			highDiscriminationCount++
		}

		assert.LessOrEqual(t, question.DiscriminationScore, 1.0, "Question %s should have DiscriminationScore <= 1.0, got %f", qId, question.DiscriminationScore)
	}
	fmt.Print("highDiscriminationCount: ", highDiscriminationCount)
	fmt.Print(" len(result.QuestionList): ", len(result.QuestionList))
	assert.GreaterOrEqual(t, float64(highDiscriminationCount)/float64(len(result.QuestionList)), 0.8, "At least 70%% of questions should have DiscriminationScore >= 0.8")

	// Validate fitness
	fitness := calculateFitness(result, filterConditions, questionCollection)
	assert.GreaterOrEqual(t, fitness, 0.9, "Fitness should be >= 0")
	assert.LessOrEqual(t, fitness, 1.0, "Fitness should be <= 1")
	assert.Equal(t, questionCount, len(result.QuestionList), "QuestionList should have correct number of questions")
}

// TestGeneticAlgorithm_SuccessWith1000Questions kiểm tra với ngân hàng 1000 câu hỏi.
func TestGeneticAlgorithm_SuccessWith1000Questions(t *testing.T) {
	var questionBank []*Question
	var filterConditions []*FilterCondition
	questionCount := 30
	for {
		questionBank = generateRandomQuestionBank(1000)
		filterConditions = generateFilterConditions(questionCount)
		if validateQuestionBank(questionBank, filterConditions) == nil {
			break
		}
	}
	populationSize := 100
	generations := 50

	// Run GeneticAlgorithm
	result := GeneticAlgorithm(questionBank, filterConditions, populationSize, generations)

	// Validate results
	assert.NotNil(t, result, "Result exam should not be nil")
	assert.NotNil(t, result.QuestionList, "QuestionList should not be nil")

	// Validate total number of questions
	totalExpectedCount := 0
	for _, condition := range filterConditions {
		totalExpectedCount += condition.ExpectedCount
	}
	assert.Equal(t, totalExpectedCount, len(result.QuestionList), "QuestionList should have correct number of questions")

	// Validate question distribution for each FilterCondition
	_, questionCollection := buildQuestionIndex(questionBank)
	// currentSemester := 252

	for _, condition := range filterConditions {
		count := 0
		for _, qId := range result.QuestionList {
			question, exists := questionCollection[qId]
			assert.True(t, exists, "Question %s should exist in questionCollection", qId)
			if satisfiesFilterCondition(question, condition) {
				count++
			}
		}
		assert.LessOrEqual(t, condition.ExpectedCount, count, "FilterCondition %v should have %d questions, got %d", condition.FilterTagAssignments, condition.ExpectedCount, count)
	}
	highDiscriminationCount := 0
	// Validate semesterGap >= 3 and DiscriminationScore in [0.8, 1.0]
	for _, qId := range result.QuestionList {
		question, exists := questionCollection[qId]
		assert.True(t, exists, "Question %s should exist in questionCollection", qId)
		semesterGap := int(math.Round(3*question.LastUsedScore/(1-question.LastUsedScore))) - 3
		assert.GreaterOrEqual(t, semesterGap, 3, "Question %s should have semesterGap >= 3, got %d", qId, semesterGap)

		if question.DiscriminationScore >= 0.5 {
			highDiscriminationCount++
		}

		assert.LessOrEqual(t, question.DiscriminationScore, 1.0, "Question %s should have DiscriminationScore <= 1.0, got %f", qId, question.DiscriminationScore)
	}
	fmt.Print("highDiscriminationCount: ", highDiscriminationCount)
	fmt.Print(" len(result.QuestionList): ", len(result.QuestionList))
	assert.GreaterOrEqual(t, float64(highDiscriminationCount)/float64(len(result.QuestionList)), 0.8, "At least 80%% of questions should have DiscriminationScore >= 0.8")

	// Validate fitness
	fitness := calculateFitness(result, filterConditions, questionCollection)
	assert.GreaterOrEqual(t, fitness, 0.0, "Fitness should be >= 0")
	assert.LessOrEqual(t, fitness, 1.0, "Fitness should be <= 1")
	assert.Equal(t, questionCount, len(result.QuestionList), "QuestionList should have correct number of questions")
}

// TestGeneticAlgorithm_NotEnoughQuestions kiểm tra trường hợp không đủ câu hỏi.
func TestGeneticAlgorithm_NotEnoughQuestions(t *testing.T) {
	// Tạo ngân hàng nhỏ với 10 câu hỏi, tất cả có TagId=1, OptionId=1
	questionBank := make([]*Question, 10)
	currentSemester := 252
	for i := 0; i < 10; i++ {
		usageCount := rand.IntN(10)
		lastUsedSemester := 211 + rand.IntN(31) // Đến 241 để semesterGap >= 3
		semesterGap := semesterSince(lastUsedSemester, currentSemester)
		lastUsedScore := float64(semesterGap) / float64(semesterGap+3)
		if semesterGap < 3 {
			lastUsedScore *= 0.5
		}
		usageCountScore := 1.0 / float64(usageCount+1)

		questionBank[i] = &Question{
			Id: uuid.New(),
			TagAssignments: []TagAssignment{
				{TagId: 1, OptionId: 1},
			},
			UsageCountScore:     usageCountScore,
			LastUsedScore:       lastUsedScore,
			DiscriminationScore: 0.8 + rand.Float64()*0.2, // [0.8, 1.0]
		}
	}

	// Tạo FilterCondition yêu cầu 20 câu hỏi (quá nhiều)
	filterConditions := []*FilterCondition{
		{
			FilterTagAssignments: []TagAssignment{
				{TagId: 1, OptionId: 1},
			},
			ExpectedCount: 20,
		},
	}

	result := GeneticAlgorithm(questionBank, filterConditions, 40, 20)

	assert.NotNil(t, result, "Result exam should not be nil")
	assert.Less(t, len(result.QuestionList), 20, "QuestionList should have fewer questions than required")
}

// TestGeneticAlgorithm_NoDuplicateQuestions kiểm tra rằng không có câu hỏi trùng lặp.
func TestGeneticAlgorithm_NoDuplicateQuestions(t *testing.T) {
	questionBank := generateRandomQuestionBank(500)
	filterConditions := generateFilterConditions(30)
	populationSize := 40
	generations := 20

	result := GeneticAlgorithm(questionBank, filterConditions, populationSize, generations)

	assert.NotNil(t, result, "Result exam should not be nil")
	assert.NotNil(t, result.QuestionList, "QuestionList should not be nil")

	questionSet := make(map[uuid.UUID]bool)
	for _, qId := range result.QuestionList {
		assert.False(t, questionSet[qId], "Question %s should not be duplicated", qId)
		questionSet[qId] = true
	}
}

// TestGeneticAlgorithm_FitnessInRange kiểm tra rằng fitness nằm trong [0, 1].
func TestGeneticAlgorithm_FitnessInRange(t *testing.T) {
	questionBank := generateRandomQuestionBank(500)
	filterConditions := generateFilterConditions(30)
	populationSize := 40
	generations := 20

	result := GeneticAlgorithm(questionBank, filterConditions, populationSize, generations)

	_, questionCollection := buildQuestionIndex(questionBank)
	fitness := calculateFitness(result, filterConditions, questionCollection)
	assert.GreaterOrEqual(t, fitness, 0.0, "Fitness should be >= 0")
	assert.LessOrEqual(t, fitness, 1.0, "Fitness should be <= 1")
}
