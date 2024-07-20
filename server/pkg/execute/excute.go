package execute

import "time"

type Executor interface {
	RunCommand(name string, args ...string) error 
}

type CommanExecutor struct {
	timeout time.Duration
}

func NewExecutor(timeout time.Duration) Executor {
	return &CommanExecutor{
		timeout: timeout,
	}
}

func (ce *CommanExecutor) RunCommand(name string, args ...string) error {
	return StartProcess(name, ce.timeout, args...)
}
