package usecase

import (
	"context"
	"cse-question-bank/internal/database/entity"
	exam_res "cse-question-bank/internal/module/exam/model/res"
	"fmt"
	"math/rand/v2"
	"sort"

	"github.com/google/uuid"
)

func (u *examUsecaseImpl) GenerateExamAuto(ctx context.Context, examId uuid.UUID) (*exam_res.ExamResponse, error) {
	questionBank, err := u.questionRepository.Find(ctx, nil, nil)
	if err != nil {
		return nil, err
	}

	exams, err := u.examRepostiroy.Find(ctx, nil, map[string]interface{}{
		"id": examId,
	})
	if err != nil {
		return nil, err
	}
	exam := exams[0]

	convertedQuestionBank := make([]*Question, 0)
	for _, question := range questionBank {
		convertedTagAssignment := make([]TagAssignment, 0)
		for _, tagAssignment := range question.TagAssignments {
			convertedTagAssignment = append(convertedTagAssignment, TagAssignment{
				TagId:    tagAssignment.TagId,
				OptionId: tagAssignment.OptionId,
			})
		}
		convertedQuestionBank = append(convertedQuestionBank, &Question{
			Id:             question.Id,
			TagAssignments: convertedTagAssignment,
			FitnessScore:   0.05,
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
			ExpectedCount: filterCondition.ExpectedCount,
			FilterTagAssignments: convertedTagAssignment,
		})
	}

	generatedExam := GeneticAlgorithm(convertedQuestionBank, convertedFilterConditions, 40, 20)
	for _, qId := range generatedExam.QuestionList {
		exam.Questions = append(exam.Questions, &entity.Question{
			Id: qId,
		})
	}

	if err = u.examRepostiroy.Update(ctx, nil, exam); err != nil {
		return nil, err
	}

	return exam_res.EntityToResponse(exam), nil
}

type TagAssignment struct {
	TagId    int
	OptionId int
}

type Question struct {
	Id             uuid.UUID
	TagAssignments []TagAssignment
	FitnessScore   float64
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

// ----------------------- Hàm khởi tạo bài thi -----------------------

func generateRandomExam(questionIndex *QuestionIndex, filterConditions []*FilterCondition) *Exam {
	exam := &Exam{
		QuestionList: make([]uuid.UUID, 0),
	}

	selectedQuestions := make(map[uuid.UUID]bool)

	for _, condition := range filterConditions {
		requiredCount := condition.ExpectedCount
		validQuestions := make(map[uuid.UUID]bool)

		for _, qId := range questionIndex.AllQuestions {
			validQuestions[qId] = true
		}

		for _, filterTag := range condition.FilterTagAssignments {
			tagId := filterTag.TagId
			optionId := filterTag.OptionId

			tagQuestions, found := questionIndex.ByTagOption[tagId][optionId]
			if !found {
				validQuestions = make(map[uuid.UUID]bool)
				break
			}

			tagQuestionSet := make(map[uuid.UUID]bool)
			for _, qId := range tagQuestions {
				tagQuestionSet[qId] = true
			}

			// remove question if not in tag
			for qId := range validQuestions {
				if !tagQuestionSet[qId] {
					delete(validQuestions, qId)
				}
			}
		}

		filteredList := make([]uuid.UUID, 0, len(validQuestions))
		for qId := range validQuestions {
			filteredList = append(filteredList, qId)
		}

		rand.Shuffle(len(filteredList), func(i, j int) { filteredList[i], filteredList[j] = filteredList[j], filteredList[i] })

		// Chọn câu hỏi đủ số lượng
		count := 0
		for _, qId := range filteredList {
			if count >= requiredCount {
				break
			}
			if selectedQuestions[qId] {
				continue
			}

			exam.QuestionList = append(exam.QuestionList, qId)
			selectedQuestions[qId] = true
			count++
		}
	}

	return exam
}

// ----------------------- Tính toán độ phù hợp -----------------------

func calculateFitness(exam *Exam, filterConditions []*FilterCondition, questionCollection map[uuid.UUID]*Question) float64 {
	matchingQuestions := 0
	totalScore := 0.0
	totalExpected := 0

	for _, condition := range filterConditions {
		totalExpected += condition.ExpectedCount
	}

	for _, qID := range exam.QuestionList {
		q, exists := questionCollection[qID]
		if !exists {
			continue
		}

		questionMatched := false
		for _, condition := range filterConditions {
			for _, filterTag := range condition.FilterTagAssignments {
				for _, tagAssign := range q.TagAssignments {
					if tagAssign.TagId == filterTag.TagId && tagAssign.OptionId == filterTag.OptionId {
						questionMatched = true
						break
					}
				}
				if questionMatched {
					break
				}
			}
			if questionMatched {
				matchingQuestions++
				totalScore += q.FitnessScore
			}
		}
	}

	if totalExpected == 0 || matchingQuestions == 0 {
		return 0
	}

	fitRatio := float64(matchingQuestions) / float64(totalExpected)

	if fitRatio < 1 {
		return fitRatio * 0.2
	}

	finalFitness := (totalScore / float64(matchingQuestions)) * fitRatio

	if finalFitness > 1 {
		finalFitness = 1
	}
	return finalFitness
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

// ----------------------- Lai ghép -----------------------

func crossover(parent1, parent2 *Exam) *Exam {
	child := &Exam{
		QuestionList: make([]uuid.UUID, 0),
	}

	usedQuestions := make(map[uuid.UUID]bool)

	cutPoint := len(parent1.QuestionList) / 2

	for i := 0; i < cutPoint; i++ {
		qId := parent1.QuestionList[i]
		child.QuestionList = append(child.QuestionList, qId)
		usedQuestions[qId] = true
	}

	for _, qId := range parent2.QuestionList {
		if !usedQuestions[qId] {
			child.QuestionList = append(child.QuestionList, qId)
			usedQuestions[qId] = true
		}

		if len(child.QuestionList) >= len(parent1.QuestionList) {
			break
		}
	}

	return child
}

// ----------------------- Đột biến -----------------------

func mutate(exam *Exam, questionCollection map[uuid.UUID]*Question) *Exam {
	if len(exam.QuestionList) == 0 || len(questionCollection) == 0 {
		return exam
	}

	newExam := &Exam{
		QuestionList: make([]uuid.UUID, len(exam.QuestionList)),
	}
	copy(newExam.QuestionList, exam.QuestionList)

	idx := rand.IntN(len(newExam.QuestionList))

	questionSet := make(map[uuid.UUID]struct{})
	for _, qID := range newExam.QuestionList {
		questionSet[qID] = struct{}{}
	}

	questionIDs := make([]uuid.UUID, 0, len(questionCollection))
	for qID := range questionCollection {
		questionIDs = append(questionIDs, qID)
	}

	maxTries := 10
	for tries := 0; tries < maxTries; tries++ {
		newQuestion := questionIDs[rand.IntN(len(questionIDs))]

		// Đảm bảo câu hỏi mới chưa có trong danh sách
		if _, exists := questionSet[newQuestion]; !exists {
			newExam.QuestionList[idx] = newQuestion
			return newExam
		}
	}

	return exam
}

// ----------------------- Thuật toán di truyền -----------------------

func GeneticAlgorithm(questionBank []*Question, filterConditions []*FilterCondition, populationSize, generations int) *Exam {
	questionIndex, questionCollection := buildQuestionIndex(questionBank)

	population := make([]*Exam, populationSize)
	for i := 0; i < populationSize; i++ {
		population[i] = generateRandomExam(questionIndex, filterConditions)
	}

	for gen := 0; gen < generations; gen++ {
		for _, exam := range population {
			exam.Fitness = calculateFitness(exam, filterConditions, questionCollection)
		}

		population = selectBest(population, populationSize/2)

		newPopulation := make([]*Exam, 0, populationSize)
		for len(newPopulation) < populationSize {
			p1, p2 := population[rand.IntN(len(population))], population[rand.IntN(len(population))]
			child := crossover(p1, p2)
			child = mutate(child, questionCollection)
			newPopulation = append(newPopulation, child)
		}
		population = newPopulation
	}
	fmt.Println(calculateFitness(population[0], filterConditions, questionCollection))
	return population[0]
}
