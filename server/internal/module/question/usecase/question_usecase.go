package usecase

type QuestionUsecase interface {

}

type questionUsecaseImpl struct {

}

func NewQuestionUsecase() QuestionUsecase {
	return &questionUsecaseImpl{}
}