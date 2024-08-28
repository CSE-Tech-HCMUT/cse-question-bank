# Start from the latest golang base image
FROM golang:latest


# Install required packages for MiKTeX
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys D6BC243565B2087BC3F897C9277A7293F59E4889


RUN echo "deb http://miktex.org/download/ubuntu bionic universe" \ 
    tee /etc/apt/sources.list.d/miktex.list \
    apt-get update \
    apt-get install miktex


# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download



# Build the Go app
RUN go build -o main ./cmd

# Command to run the executable
CMD ["./main"]