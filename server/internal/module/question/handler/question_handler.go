package handler

type QuestionHandler interface {

}

type questionHandlerImpl struct {

}

func NewQuestionHandler() QuestionHandler{
	return &questionHandlerImpl{}
}