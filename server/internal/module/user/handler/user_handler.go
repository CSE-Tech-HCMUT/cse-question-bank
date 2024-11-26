package handler

import "cse-question-bank/internal/module/user/usecase"

type UserHandler interface {
}

type userHandlerImpl struct {
	userUsecase usecase.UserUsecase
}

func NewUserHandler(
	userUsecase usecase.UserUsecase,
) UserHandler {
	return &userHandlerImpl{
		userUsecase: userUsecase,
	}
}