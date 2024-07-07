package execute

import (
	"context"
	"os/exec"
	"time"
)

func StartProcess(name string, timeout time.Duration, args ...string) error {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, name, args...)
	err := cmd.Start()
	if err != nil {
		return err
	}

	done := make(chan error)
	go func() {
		done <- cmd.Wait()
	}()

	select {
	case <- ctx.Done():
		if err := cmd.Process.Kill(); err != nil {
			return err
		}
		return ctx.Err()
	case err := <- done:
		if err != nil {
			return err
		}
	}

	return nil
}
