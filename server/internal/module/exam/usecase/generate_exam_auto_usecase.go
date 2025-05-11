package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"fmt"
	"log/slog"
	"math/rand/v2"
	"sort"

	"github.com/google/uuid"
)

type TagAssignment struct {
	TagId    int
	OptionId int
}

type Question struct {
	Id                  uuid.UUID
	TagAssignments      []TagAssignment
	UsageCountScore     float64 // Number of times the question was used
	LastUsedScore       float64 // Unix timestamp of last usage
	DiscriminationScore float64 // Error rate (0 to 1)
}

type Exam struct {
	QuestionList []uuid.UUID
	Fitness      float64
}

type QuestionIndex struct {
	ByTagOption  map[int]map[int][]uuid.UUID
	AllQuestions []uuid.UUID
}

type FilterCondition struct {
	FilterTagAssignments []TagAssignment
	ExpectedCount        int
}

func semesterSince(semester1, semester2 int) int {
	if semester1 == semester2 {
		return 0
	}
	// Semester format: 221, 231, 232, etc.
	// 22: year 2022, 1: semester 1
	var yearGap int
	if semester1 > semester2 {
		yearGap = semester1/10 - semester2/10
		return yearGap*3 + semester1%10 - semester2%10
	}
	yearGap = semester2/10 - semester1/10
	return yearGap*3 + semester2%10 - semester1%10
}

func validateQuestionBank(questionBank []*Question, filterConditions []*FilterCondition) error {
	// Check if questionBank satisfies filterConditions
	for _, filterCondition := range filterConditions {
		count := 0
		for _, question := range questionBank {
			matches := true
			for _, filterTag := range filterCondition.FilterTagAssignments {
				tagMatched := false
				for _, questionTag := range question.TagAssignments {
					if questionTag.TagId == filterTag.TagId && questionTag.OptionId == filterTag.OptionId {
						tagMatched = true
						break
					}
				}
				if !tagMatched {
					matches = false
					break
				}
			}
			if matches {
				count++
			}
		}
		if count < filterCondition.ExpectedCount {
			return fmt.Errorf("not enough questions in the question bank to satisfy filter condition: %+v", filterCondition)
		}
	}
	return nil
}

func (u *examUsecaseImpl) GenerateExamAuto(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	questionBank, err := u.questionRepository.Find(ctx, nil, nil)
	if err != nil {
		slog.Error("Failed to fetch question bank", "error-message", err)
		return nil, err
	}

	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if err != nil {
		slog.Error("Failed to fetch exam from repository", "error-message", err)
		return nil, err
	}
	exam := exams[0]

	// Convert question bank with historical factors
	convertedQuestionBank := make([]*Question, 0)
	for _, question := range questionBank {
		convertedTagAssignment := make([]TagAssignment, 0)
		for _, tagAssignment := range question.TagAssignments {
			convertedTagAssignment = append(convertedTagAssignment, TagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}

		// Calculate historical factors
		semesterGap := semesterSince(question.LastUsedSemester, 252)
		lastUsedScore := float64(semesterGap) / float64(semesterGap+3) // priority question not used in 3 semesters
		if semesterGap < 3 {
			lastUsedScore *= 0.5 // Apply penalty if semesterGap < 3
		}
		usageCountScore := 1.0 / (float64(question.UsageCount) + 1) // priority question less used

		convertedQuestionBank = append(convertedQuestionBank, &Question{
			Id:                  question.Id,
			TagAssignments:      convertedTagAssignment,
			LastUsedScore:       lastUsedScore,
			UsageCountScore:     usageCountScore,
			DiscriminationScore: question.DiscriminationScore,
		})
	}
	convertedFilterConditions := make([]*FilterCondition, 0)
	for _, filterCondition := range exam.FilterConditions {
		convertedTagAssignment := make([]TagAssignment, 0)
		for _, tagAssignment := range filterCondition.FilterTagAssignments {
			convertedTagAssignment = append(convertedTagAssignment, TagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}
		convertedFilterConditions = append(convertedFilterConditions, &FilterCondition{
			ExpectedCount:        filterCondition.ExpectedCount,
			FilterTagAssignments: convertedTagAssignment,
		})
	}

	if err = validateQuestionBank(convertedQuestionBank, convertedFilterConditions); err != nil {
		return nil, err
	}

	// Pass maxUsageCount to normalize in calculateFitness
	generatedExam := GeneticAlgorithm(convertedQuestionBank, convertedFilterConditions, 40, 20)
	for _, qId := range generatedExam.QuestionList {
		exam.Questions = append(exam.Questions, &entity.Question{
			Id: qId,
		})
	}

	if err = u.examRepostiroy.Update(ctx, nil, exam); err != nil {
		slog.Error("Failed to update exam in repository", "error-message", err)
		return nil, err
	}

	return exam_res.EntityToResponse(exam), nil
}

// ----------------------- Hàm khởi tạo dữ liệu -----------------------

func buildQuestionIndex(questionBank []*Question) (*QuestionIndex, map[uuid.UUID]*Question) {
	questionIndex := &QuestionIndex{
		ByTagOption:  make(map[int]map[int][]uuid.UUID),
		AllQuestions: make([]uuid.UUID, 0),
	}
	questionCollection := make(map[uuid.UUID]*Question)

	for _, question := range questionBank {
		questionIndex.AllQuestions = append(questionIndex.AllQuestions, question.Id)
		questionCollection[question.Id] = question

		for _, tagAssignment := range question.TagAssignments {
			tagId := tagAssignment.TagId
			optionId := tagAssignment.OptionId

			if _, exists := questionIndex.ByTagOption[tagId]; !exists {
				questionIndex.ByTagOption[tagId] = make(map[int][]uuid.UUID)
			}

			questionIndex.ByTagOption[tagId][optionId] = append(
				questionIndex.ByTagOption[tagId][optionId],
				question.Id,
			)
		}
	}

	return questionIndex, questionCollection
}

// generateRandomExam creates a random exam that satisfies all filter conditions with exact ExpectedCount
func generateRandomExam(questionIndex *QuestionIndex, questionCollection map[uuid.UUID]*Question, filterConditions []*FilterCondition) (*Exam, error) {
	exam := &Exam{
		QuestionList: make([]uuid.UUID, 0),
	}
	selectedQuestions := make(map[uuid.UUID]bool)

	// // Step 1: Verify that enough questions are available for each filter condition
	// for fcIdx, fc := range filterConditions {
	// 	validQuestions := make(map[uuid.UUID]bool)
	// 	for _, qId := range questionIndex.AllQuestions {
	// 		question, exists := questionCollection[qId]
	// 		if !exists {
	// 			continue
	// 		}
	// 		if satisfiesFilterCondition(question, fc) {
	// 			validQuestions[qId] = true
	// 		}
	// 	}
	// 	if len(validQuestions) < fc.ExpectedCount {
	// 		return nil, fmt.Errorf("not enough questions for filter condition %d: available %d, expected %d", fcIdx, len(validQuestions), fc.ExpectedCount)
	// 	}
	// }

	// Step 2: Allocate questions to satisfy each filter condition
	counts := make([]int, len(filterConditions)) // Track number of questions per filter condition
	remainingCounts := make([]int, len(filterConditions))
	for i, fc := range filterConditions {
		remainingCounts[i] = fc.ExpectedCount
	}

	// Build a list of valid questions for each filter condition
	validQuestionsPerFC := make([][]uuid.UUID, len(filterConditions))
	for i, fc := range filterConditions {
		for _, qId := range questionIndex.AllQuestions {
			question, exists := questionCollection[qId]
			if !exists {
				continue
			}
			if satisfiesFilterCondition(question, fc) {
				validQuestionsPerFC[i] = append(validQuestionsPerFC[i], qId)
			}
		}
		rand.Shuffle(len(validQuestionsPerFC[i]), func(j, k int) {
			validQuestionsPerFC[i][j], validQuestionsPerFC[i][k] = validQuestionsPerFC[i][k], validQuestionsPerFC[i][j]
		})
	}

	// Step 3: Greedy allocation to meet ExpectedCount
	for len(exam.QuestionList) < sumExpectedCounts(filterConditions) && anyRemaining(remainingCounts) {
		// Find filter condition with highest remaining need
		maxNeedIdx := -1
		maxNeed := -1
		for i, rc := range remainingCounts {
			if rc > maxNeed {
				maxNeed = rc
				maxNeedIdx = i
			}
		}
		if maxNeedIdx == -1 {
			break
		}

		// Select a question for this filter condition
		for _, qId := range validQuestionsPerFC[maxNeedIdx] {
			if selectedQuestions[qId] {
				continue
			}
			exam.QuestionList = append(exam.QuestionList, qId)
			selectedQuestions[qId] = true
			// Update counts and remaining counts
			question, exists := questionCollection[qId]
			if exists {
				for i, fc := range filterConditions {
					if satisfiesFilterCondition(question, fc) {
						counts[i]++
						if remainingCounts[i] > 0 {
							remainingCounts[i]--
						}
					}
				}
			}
			break
		}
	}

	// Step 4: Verify exact ExpectedCount
	counts = countQuestionsPerFilter(exam, questionCollection, filterConditions)
	for i, fc := range filterConditions {
		if counts[i] != fc.ExpectedCount {
			return nil, fmt.Errorf("exam does not satisfy filter condition %d: got %d, expected %d", i, counts[i], fc.ExpectedCount)
		}
	}

	return exam, nil
}

// sumExpectedCounts calculates the total ExpectedCount across all filter conditions
func sumExpectedCounts(filterConditions []*FilterCondition) int {
	total := 0
	for _, fc := range filterConditions {
		total += fc.ExpectedCount
	}
	return total
}

// anyRemaining checks if any filter condition still needs questions
func anyRemaining(remainingCounts []int) bool {
	for _, rc := range remainingCounts {
		if rc > 0 {
			return true
		}
	}
	return false
}

// ----------------------- Tính toán độ phù hợp -----------------------

func calculateFitness(exam *Exam, filterConditions []*FilterCondition, questionCollection map[uuid.UUID]*Question) float64 {
	const (
		w1      = 0.3  // Weight for UsageCount
		w2      = 0.4  // Weight for LastUsedTime
		w3      = 0.3  // Weight for ErrorRate
		epsilon = 1e-6 // Small constant to avoid division by zero
	)

	totalFitness := 0.0
	for _, qID := range exam.QuestionList {
		q, exists := questionCollection[qID]
		if !exists {
			continue
		}

		// // Normalize historical factors
		// normalizedUsageCount := float64(q.UsageCount) / float64(maxUsageCount)
		// normalizedLastUsedTime := float64(q.LastUsedTime) / currentTime
		// normalizedErrorRate := q.ErrorRate // Already in [0,1]

		// Calculate fitness for this question
		questionFitness := w1*q.UsageCountScore + w2*q.LastUsedScore + w3*q.DiscriminationScore
		totalFitness += questionFitness
	}

	// Since lower fitness is better, invert to make higher fitness better for GA
	// Use epsilon to avoid division by zero
	// invertedFitness := 1.0 / (totalFitness + epsilon)
	invertedFitness := totalFitness / (float64(len(exam.QuestionList)) + epsilon)
	// Ensure fitness is in [0,1]
	if invertedFitness > 1.0 {
		invertedFitness = 1.0
	}
	if invertedFitness < 0.0 {
		invertedFitness = 0.0
	}

	return invertedFitness
}

// ----------------------- Chọn lọc cá thể tốt nhất -----------------------

func selectBest(population []*Exam, numBest int) []*Exam {
	sort.Slice(population, func(i, j int) bool {
		return population[i].Fitness > population[j].Fitness
	})

	if len(population) < numBest {
		return population
	}
	return population[:numBest]
}

// crossover performs a fitness-based crossover while ensuring filter conditions are satisfied
func crossover(parent1, parent2 *Exam, questionCollection map[uuid.UUID]*Question, filterConditions []*FilterCondition) *Exam {
	if len(parent1.QuestionList) == 0 || len(parent2.QuestionList) == 0 {
		return &Exam{QuestionList: make([]uuid.UUID, 0)}
	}

	const maxRetries = 10 // Giới hạn số lần thử sửa chữa

	// Initialize child
	child := &Exam{
		QuestionList: make([]uuid.UUID, 0),
	}
	usedQuestions := make(map[uuid.UUID]bool)

	// Calculate fitness for questions in both parents
	questionFitness := make(map[uuid.UUID]float64)
	totalFitness := 0.0
	for _, parent := range []*Exam{parent1, parent2} {
		for _, qID := range parent.QuestionList {
			if _, exists := usedQuestions[qID]; exists {
				continue
			}
			question, exists := questionCollection[qID]
			if !exists {
				continue
			}
			fitness := 0.3*question.UsageCountScore + 0.4*question.LastUsedScore + 0.3*question.DiscriminationScore
			questionFitness[qID] = fitness
			totalFitness += fitness
			usedQuestions[qID] = true
		}
	}

	// Reset usedQuestions for child construction
	usedQuestions = make(map[uuid.UUID]bool)

	// Track filter condition counts
	counts := make([]int, len(filterConditions))
	targetSize := sumExpectedCounts(filterConditions)
	i := 0
	// Select questions based on fitness
	for len(child.QuestionList) < targetSize && totalFitness > 0 && i <= 10 {
		r := rand.Float64() * totalFitness
		var selectedQID uuid.UUID
		for qID, fitness := range questionFitness {
			r -= fitness
			if r <= 0 {
				selectedQID = qID
				break
			}
		}
		if selectedQID == uuid.Nil {
			continue
		}

		if !usedQuestions[selectedQID] {
			child.QuestionList = append(child.QuestionList, selectedQID)
			usedQuestions[selectedQID] = true
			question, exists := questionCollection[selectedQID]
			if exists {
				for i, fc := range filterConditions {
					if satisfiesFilterCondition(question, fc) {
						counts[i]++
					}
				}
			}
			totalFitness -= questionFitness[selectedQID]
			delete(questionFitness, selectedQID)
		}
		i++
	}

	// Repair: Ensure exact ExpectedCount for each filter condition
	for i, fc := range filterConditions {
		retries := 0
		// Add missing questions
		for counts[i] < fc.ExpectedCount && retries < maxRetries {
			questionScores := make(map[uuid.UUID]float64)
			totalScore := 0.0
			for qID, question := range questionCollection {
				if usedQuestions[qID] {
					continue
				}
				if !satisfiesFilterCondition(question, fc) {
					continue
				}
				combinedScore := 0.4*question.DiscriminationScore + 0.3*question.LastUsedScore + 0.3*question.UsageCountScore
				questionScores[qID] = combinedScore
				totalScore += combinedScore
			}
			if totalScore == 0 {
				return parent1 // Fallback if no valid question
			}
			r := rand.Float64() * totalScore
			var selectedQID uuid.UUID
			for qID, score := range questionScores {
				r -= score
				if r <= 0 {
					selectedQID = qID
					break
				}
			}
			if selectedQID != uuid.Nil {
				child.QuestionList = append(child.QuestionList, selectedQID)
				usedQuestions[selectedQID] = true
				question, exists := questionCollection[selectedQID]
				if exists {
					for j, fcOther := range filterConditions {
						if satisfiesFilterCondition(question, fcOther) {
							counts[j]++
						}
					}
				}
			}
			retries++
		}

		// Remove excess questions
		retries = 0
		for counts[i] > fc.ExpectedCount && retries < maxRetries {
			removed := false
			for j := len(child.QuestionList) - 1; j >= 0; j-- {
				qID := child.QuestionList[j]
				question, exists := questionCollection[qID]
				if !exists || !satisfiesFilterCondition(question, fc) {
					continue
				}
				// Simulate removal
				newCounts := make([]int, len(filterConditions))
				for k, qID2 := range child.QuestionList {
					if k == j {
						continue
					}
					q2, exists := questionCollection[qID2]
					if !exists {
						continue
					}
					for m, fc2 := range filterConditions {
						if satisfiesFilterCondition(q2, fc2) {
							newCounts[m]++
						}
					}
				}
				valid := true
				for m, fc2 := range filterConditions {
					if newCounts[m] < fc2.ExpectedCount {
						valid = false
						break
					}
				}
				if valid {
					child.QuestionList = append(child.QuestionList[:j], child.QuestionList[j+1:]...)
					delete(usedQuestions, qID)
					for m, fc2 := range filterConditions {
						if satisfiesFilterCondition(question, fc2) {
							counts[m]--
						}
					}
					removed = true
					break
				}
			}
			if !removed {
				break // Avoid infinite loop if no question can be removed
			}
			retries++
		}
	}

	// Final validation
	finalCounts := countQuestionsPerFilter(child, questionCollection, filterConditions)
	for i, fc := range filterConditions {
		if finalCounts[i] != fc.ExpectedCount {
			return parent1 // Fallback if repair fails
		}
	}

	return child
}

// ----------------------- Đột biến -----------------------

// satisfiesFilterCondition checks if a question satisfies a specific filter condition
func satisfiesFilterCondition(question *Question, fc *FilterCondition) bool {
	for _, filterTag := range fc.FilterTagAssignments {
		tagMatched := false
		for _, questionTag := range question.TagAssignments {
			if questionTag.TagId == filterTag.TagId && questionTag.OptionId == filterTag.OptionId {
				tagMatched = true
				break
			}
		}
		if !tagMatched {
			return false
		}
	}
	return true
}

// countQuestionsPerFilter counts the number of questions satisfying each filter condition
func countQuestionsPerFilter(exam *Exam, questionCollection map[uuid.UUID]*Question, filterConditions []*FilterCondition) []int {
	counts := make([]int, len(filterConditions))
	for _, qID := range exam.QuestionList {
		question, exists := questionCollection[qID]
		if !exists {
			continue
		}
		for i, fc := range filterConditions {
			if satisfiesFilterCondition(question, fc) {
				counts[i]++
			}
		}
	}
	return counts
}

// mutate performs a strategic mutation while ensuring filter conditions are satisfied
func mutate(exam *Exam, questionCollection map[uuid.UUID]*Question, filterConditions []*FilterCondition) *Exam {
	if len(exam.QuestionList) == 0 || len(questionCollection) == 0 {
		return exam
	}

	const maxRetries = 20 // Giới hạn số lần thử sửa chữa

	// Create a copy of the exam
	newExam := &Exam{
		QuestionList: make([]uuid.UUID, len(exam.QuestionList)),
	}
	copy(newExam.QuestionList, exam.QuestionList)

	// Count questions satisfying each filter condition
	counts := countQuestionsPerFilter(newExam, questionCollection, filterConditions)

	// Select a question to replace
	questionFitness := make(map[uuid.UUID]float64)
	for _, qID := range newExam.QuestionList {
		q, exists := questionCollection[qID]
		if !exists {
			continue
		}
		fitness := 0.3*q.UsageCountScore + 0.4*q.LastUsedScore + 0.3*q.DiscriminationScore
		questionFitness[qID] = fitness
	}

	// Identify redundant questions
	redundantQuestions := make(map[uuid.UUID][]int)
	for _, qID := range newExam.QuestionList {
		question, exists := questionCollection[qID]
		if !exists {
			continue
		}
		for i, fc := range filterConditions {
			if satisfiesFilterCondition(question, fc) && counts[i] > fc.ExpectedCount {
				redundantQuestions[qID] = append(redundantQuestions[qID], i)
			}
		}
	}

	var replaceIdx int
	var replaceQID uuid.UUID
	if len(redundantQuestions) > 0 {
		questionIDs := make([]uuid.UUID, 0, len(redundantQuestions))
		for qID := range redundantQuestions {
			questionIDs = append(questionIDs, qID)
		}
		replaceQID = questionIDs[rand.IntN(len(questionIDs))]
		for i, qID := range newExam.QuestionList {
			if qID == replaceQID {
				replaceIdx = i
				break
			}
		}
	} else {
		var lowestFitness float64 = 1.0
		for i, qID := range newExam.QuestionList {
			fitness, exists := questionFitness[qID]
			if !exists {
				continue
			}
			if fitness < lowestFitness {
				lowestFitness = fitness
				replaceQID = qID
				replaceIdx = i
			}
		}
	}

	// Identify filter conditions that the replaced question satisfies
	replacedFCs := make([]int, 0)
	question, exists := questionCollection[replaceQID]
	if exists {
		for i, fc := range filterConditions {
			if satisfiesFilterCondition(question, fc) {
				replacedFCs = append(replacedFCs, i)
			}
		}
	}

	// Create a set of questions already in the exam
	questionSet := make(map[uuid.UUID]struct{})
	for _, qID := range newExam.QuestionList {
		questionSet[qID] = struct{}{}
	}

	// Try to find a replacement question
	questionScores := make(map[uuid.UUID]float64)
	totalScore := 0.0
	for qID, question := range questionCollection {
		if _, exists := questionSet[qID]; exists {
			continue
		}
		satisfiesRelevantFC := false
		for _, fcIdx := range replacedFCs {
			if satisfiesFilterCondition(question, filterConditions[fcIdx]) {
				satisfiesRelevantFC = true
				break
			}
		}
		if !satisfiesRelevantFC {
			continue
		}
		combinedScore := 0.4*question.DiscriminationScore + 0.3*question.LastUsedScore + 0.3*question.UsageCountScore
		questionScores[qID] = combinedScore
		totalScore += combinedScore
	}

	if totalScore > 0 {
		r := rand.Float64() * totalScore
		for qID, score := range questionScores {
			r -= score
			if r <= 0 {
				newExam.QuestionList[replaceIdx] = qID
				counts = countQuestionsPerFilter(newExam, questionCollection, filterConditions)
				questionSet[qID] = struct{}{}
				delete(questionSet, replaceQID)
				break
			}
		}
	}

	// Repair: Ensure exact ExpectedCount for each filter condition
	for i, fc := range filterConditions {
		retries := 0
		// Add missing questions
		for counts[i] < fc.ExpectedCount && retries < maxRetries {
			questionScores := make(map[uuid.UUID]float64)
			totalScore := 0.0
			for qID, question := range questionCollection {
				if _, exists := questionSet[qID]; exists {
					continue
				}
				if !satisfiesFilterCondition(question, fc) {
					continue
				}
				combinedScore := 0.4*question.DiscriminationScore + 0.3*question.LastUsedScore + 0.3*question.UsageCountScore
				questionScores[qID] = combinedScore
				totalScore += combinedScore
			}
			if totalScore == 0 {
				return exam // Fallback if no valid question
			}
			r := rand.Float64() * totalScore
			var selectedQID uuid.UUID
			for qID, score := range questionScores {
				r -= score
				if r <= 0 {
					selectedQID = qID
					break
				}
			}
			if selectedQID != uuid.Nil {
				newExam.QuestionList = append(newExam.QuestionList, selectedQID)
				questionSet[selectedQID] = struct{}{}
				question, exists := questionCollection[selectedQID]
				if exists {
					for j, fcOther := range filterConditions {
						if satisfiesFilterCondition(question, fcOther) {
							counts[j]++
						}
					}
				}
			}
			retries++
		}

		// Remove excess questions
		retries = 0
		for counts[i] > fc.ExpectedCount && retries < maxRetries {
			removed := false
			for j := len(newExam.QuestionList) - 1; j >= 0; j-- {
				qID := newExam.QuestionList[j]
				question, exists := questionCollection[qID]
				if !exists || !satisfiesFilterCondition(question, fc) {
					continue
				}
				// Simulate removal
				newCounts := make([]int, len(filterConditions))
				for k, qID2 := range newExam.QuestionList {
					if k == j {
						continue
					}
					q2, exists := questionCollection[qID2]
					if !exists {
						continue
					}
					for m, fc2 := range filterConditions {
						if satisfiesFilterCondition(q2, fc2) {
							newCounts[m]++
						}
					}
				}
				valid := true
				for m, fc2 := range filterConditions {
					if newCounts[m] < fc2.ExpectedCount {
						valid = false
						break
					}
				}
				if valid {
					newExam.QuestionList = append(newExam.QuestionList[:j], newExam.QuestionList[j+1:]...)
					delete(questionSet, qID)
					for m, fc2 := range filterConditions {
						if satisfiesFilterCondition(question, fc2) {
							counts[m]--
						}
					}
					removed = true
					break
				}
			}
			if !removed {
				break // Avoid infinite loop if no question can be removed
			}
			retries++
		}
	}

	// Final validation
	finalCounts := countQuestionsPerFilter(newExam, questionCollection, filterConditions)
	for i, fc := range filterConditions {
		if finalCounts[i] != fc.ExpectedCount {
			return exam // Fallback if repair fails
		}
	}

	return newExam
}

func repairExam(exam *Exam, questionCollection map[uuid.UUID]*Question, filterConditions []*FilterCondition, questionBank []*Question) *Exam {
	const maxRetries = 100 // Giới hạn số lần thử để tránh lặp vô tận

	// Tạo bản sao của exam để tránh sửa đổi trực tiếp
	repairedExam := &Exam{
		QuestionList: make([]uuid.UUID, len(exam.QuestionList)),
		Fitness:      exam.Fitness,
	}
	copy(repairedExam.QuestionList, exam.QuestionList)

	// Tập hợp các câu hỏi đã sử dụng
	usedQuestions := make(map[uuid.UUID]struct{})
	for _, qID := range repairedExam.QuestionList {
		usedQuestions[qID] = struct{}{}
	}

	// Đếm số câu hỏi thỏa mãn mỗi FilterCondition
	counts := countQuestionsPerFilter(repairedExam, questionCollection, filterConditions)
	target := 0
	// Sửa chữa: Thêm câu hỏi nếu thiếu
	for i, fc := range filterConditions {
		retries := 0
		target += fc.ExpectedCount
		for counts[i] < fc.ExpectedCount && retries < maxRetries {
			// Tìm các câu hỏi thỏa mãn FilterCondition từ questionBank
			questionScores := make(map[uuid.UUID]float64)
			totalScore := 0.0
			for _, question := range questionBank {
				qID := question.Id
				if _, exists := usedQuestions[qID]; exists {
					continue
				}
				if !satisfiesFilterCondition(question, fc) {
					continue
				}
				// Tính điểm fitness cho câu hỏi
				combinedScore := 0.4*question.DiscriminationScore + 0.3*question.LastUsedScore + 0.3*question.UsageCountScore
				questionScores[qID] = combinedScore
				totalScore += combinedScore
			}

			if totalScore == 0 {
				// Không có câu hỏi phù hợp, trả về exam gốc
				return exam
			}

			// Chọn ngẫu nhiên câu hỏi dựa trên fitness
			r := rand.Float64() * totalScore
			var selectedQID uuid.UUID
			for qID, score := range questionScores {
				r -= score
				if r <= 0 {
					selectedQID = qID
					break
				}
			}

			if selectedQID != uuid.Nil {
				repairedExam.QuestionList = append(repairedExam.QuestionList, selectedQID)
				usedQuestions[selectedQID] = struct{}{}
				// Cập nhật counts
				question, exists := questionCollection[selectedQID]
				if exists {
					for j, fcOther := range filterConditions {
						if satisfiesFilterCondition(question, fcOther) {
							counts[j]++
						}
					}
				}
			}
			retries++
		}
	}

	// Kiểm tra tổng số câu hỏi (giả sử cần đúng 30 câu hỏi)
	targetSize := target
	if len(repairedExam.QuestionList) > targetSize {
		// Xóa bớt câu hỏi dư thừa, ưu tiên giữ các FilterCondition
		for len(repairedExam.QuestionList) > targetSize {
			removed := false
			for j := len(repairedExam.QuestionList) - 1; j >= 0; j-- {
				qID := repairedExam.QuestionList[j]
				_, exists := questionCollection[qID]
				if !exists {
					continue
				}
				// Kiểm tra xem việc xóa câu hỏi này có làm vi phạm FilterCondition không
				newCounts := make([]int, len(filterConditions))
				for k, qID2 := range repairedExam.QuestionList {
					if k == j {
						continue
					}
					q2, exists := questionCollection[qID2]
					if !exists {
						continue
					}
					for m, fc2 := range filterConditions {
						if satisfiesFilterCondition(q2, fc2) {
							newCounts[m]++
						}
					}
				}
				valid := true
				for m, fc2 := range filterConditions {
					if newCounts[m] < fc2.ExpectedCount {
						valid = false
						break
					}
				}
				if valid {
					repairedExam.QuestionList = append(repairedExam.QuestionList[:j], repairedExam.QuestionList[j+1:]...)
					delete(usedQuestions, qID)
					removed = true
					break
				}
			}
			if !removed {
				break // Thoát nếu không thể xóa thêm
			}
		}
	}

	// // Kiểm tra cuối cùng
	// finalCounts := countQuestionsPerFilter(repairedExam, questionCollection, filterConditions)

	// for i, fc := range filterConditions {
	//     if finalCounts[i] != fc.ExpectedCount {
	//         return exam // Trả về exam gốc nếu không sửa chữa được
	//     }
	// }

	// Cập nhật fitness cho bài thi đã sửa chữa
	repairedExam.Fitness = calculateFitness(repairedExam, filterConditions, questionCollection)
	return repairedExam
}

// ----------------------- Thuật toán di truyền -----------------------

func GeneticAlgorithm(questionBank []*Question, filterConditions []*FilterCondition, populationSize, generations int) *Exam {
	questionIndex, questionCollection := buildQuestionIndex(questionBank)

	population := make([]*Exam, 0, populationSize) // Initialize with capacity but no nil values
	for i := 0; i < populationSize; i++ {
		newP, err := generateRandomExam(questionIndex, questionCollection, filterConditions)
		if err == nil {
			population = append(population, newP)
		}
	}

	// Ensure population is not empty
	if len(population) == 0 {
		// panic("Failed to generate initial population: no valid exams could be created")
		return nil
	}

	for gen := 0; gen < generations; gen++ {
		for _, exam := range population {
			exam.Fitness = calculateFitness(exam, filterConditions, questionCollection)
		}

		population = selectBest(population, populationSize/2)
		newPopulation := make([]*Exam, 0, populationSize)
		for len(newPopulation) < populationSize {
			p1, p2 := population[rand.IntN(len(population))], population[rand.IntN(len(population))]
			child := crossover(p1, p2, questionCollection, filterConditions)
			// Sửa chữa sau crossover
			child = repairExam(child, questionCollection, filterConditions, questionBank)

			child = mutate(child, questionCollection, filterConditions)

			// Sửa chữa sau mutation
			child = repairExam(child, questionCollection, filterConditions, questionBank)
			newPopulation = append(newPopulation, child)
			if len(child.QuestionList) != 30 {
				fmt.Println("Error: child has wrong number of questions")
			}
		}
		population = newPopulation
	}
	fmt.Println(calculateFitness(population[0], filterConditions, questionCollection))
	return population[0]
}
