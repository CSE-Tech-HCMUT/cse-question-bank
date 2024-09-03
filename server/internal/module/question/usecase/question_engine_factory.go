package usecase

import (
	"cse-question-bank/internal/module/question/model"
	"cse-question-bank/internal/module/question/repository"
)

type questionEngine interface {
}

type questionEngineFactory struct {
	engineMap map[model.QuestionType]func() questionEngine
}

func NewQuestionUsecaseFactory(repo repository.QuestionRepository) questionEngine {
	return &questionEngineFactory{
		engineMap: map[model.QuestionType]func() questionEngine{
			model.MultipleChoice: func() questionEngine { return &multipleChoiceEngine{} },
			model.DragAndDrop:    func() questionEngine { return &dragAndDropEngine{} },
			model.FillInBlank:    func() questionEngine { return &fillInBlankEngine{} },
		},
	}
}
