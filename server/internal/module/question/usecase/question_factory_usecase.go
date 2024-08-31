package usecase

import (
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
	"fmt"
)

type questionFactoryUsecase struct {
	usecaseMap map[model.QuestionType]func() QuestionUsecase
}

func NewQuestionUsecaseFactory(repo repository.QuestionRepository) *questionFactoryUsecase {
	base := questionBaseUsecaseImpl{
		repo: repo,
	}

	return &questionFactoryUsecase{
		usecaseMap: map[model.QuestionType]func() QuestionUsecase{
			model.MultipleChoice: func() QuestionUsecase { return &multipleChoiceUsecaseImpl{questionBaseUsecaseImpl: base} },
			model.DragAndDrop:    func() QuestionUsecase { return &dragAndDropUsecaseImpl{questionBaseUsecaseImpl: base} },
			model.FillInBlank:    func() QuestionUsecase { return &fillInBlankUsecaseImpl{questionBaseUsecaseImpl: base} },
		},
	}
}

func (f *questionFactoryUsecase) getUsecase(questionType model.QuestionType) (QuestionUsecase, error) {
	if constructor, exists := f.usecaseMap[questionType]; exists {
		return constructor(), nil
	}

	return nil, fmt.Errorf("question type '%s' not recognized", questionType)
}

func (f *questionFactoryUsecase) GetQuestion() {

}