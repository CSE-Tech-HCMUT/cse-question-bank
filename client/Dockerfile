# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Install yarn
RUN corepack enable

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN yarn


# Expose the port the app runs on
EXPOSE 3000

# Run client
CMD ["yarn",  "dev"]