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
FROM ubuntu:jammy

RUN apt-get update && \
    apt-get install curl -y && \
    curl -fsSL https://miktex.org/download/key | tee /usr/share/keyrings/miktex-keyring.asc > /dev/null && \
    echo "deb [signed-by=/usr/share/keyrings/miktex-keyring.asc] https://miktex.org/download/ubuntu jammy universe" \
    | tee /etc/apt/sources.list.d/miktex.list   

RUN apt-get update && \
    apt-get install python3-pygments -y && \
    apt-get install miktex -y && \
    miktexsetup finish

RUN initexmf --set-config-value=[MPM]AutoInstall=yes

RUN mpm --admin --update

WORKDIR /app
# Copy the Go application from the builder stage
COPY --from=builder /app /app


# need to pre-compile to check if the latex compiler works
# RUN pdflatex -output-directory=./internal/module/latex_compiler/latex_source/ -interaction=batchmode -shell-escape ./internal/module/latex_compiler/latex_source/example.tex





# Set the entry point to run the Go application
ENTRYPOINT ["/app/main"]