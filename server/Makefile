# Project variables
APP_NAME := cse-question-bank
BUILD_DIR := ./bin
SRC_DIR := ./cmd/main.go
DEBUG_FLAG = --debug
DEV_FLAG = --dev

# OS detection
OS := $(shell uname -s)
ifeq ($(OS), Linux)
    EXT :=
else
    EXT := .exe
endif

.PHONY: all swag build run test lint clean

all: swag build

# Generate Swagger documentation
swag:
	@echo "Generating Swagger documentation..."
	swag init -g $(SRC_DIR)

# Build project
build: swag
	@echo "Building $(APP_NAME)..."
	go build -o $(BUILD_DIR)/$(APP_NAME)$(EXT) $(SRC_DIR)

# Run project
run: build
	@echo "Running $(APP_NAME)..."
	$(BUILD_DIR)/$(APP_NAME)$(EXT)

# Run tests
test:
	@echo "Running tests..."
	go test ./... -v

# Run linting
lint:
	@echo "Running linter..."
	golangci-lint run

# Clean build directory
clean:
	@echo "Cleaning..."
	rm -rf $(BUILD_DIR)
