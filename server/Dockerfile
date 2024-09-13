FROM golang:latest AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download



# Build the Go app
RUN go build -o main ./cmd


# miktex
FROM miktex/miktex:latest


RUN mpm --admin --update

WORKDIR /app
# Copy the Go application from the builder stage
COPY --from=builder /app /app

RUN pdflatex -output-directory=./internal/module/latex_compiler/latex_source/ -interaction=batchmode -shell-escape ./internal/module/latex_compiler/latex_source/example.tex





# Set the entry point to run the Go application
ENTRYPOINT ["/app/main"]