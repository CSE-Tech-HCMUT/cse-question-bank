package usecase

import (
	"cse-question-bank/internal/module/question/model/entity"
	"cse-question-bank/internal/module/question/repository"
)

type questionEngine interface {
}

type questionEngineFactory struct {
	engineMap map[entity.QuestionType]func() questionEngine
}

func NewQuestionUsecaseFactory(repo repository.QuestionRepository) questionEngine {
	return &questionEngineFactory{
		engineMap: map[entity.QuestionType]func() questionEngine{
			entity.MultipleChoice: func() questionEngine { return &multipleChoiceEngine{} },
			entity.DragAndDrop:    func() questionEngine { return &dragAndDropEngine{} },
			entity.FillInBlank:    func() questionEngine { return &fillInBlankEngine{} },
		},
	}
}
