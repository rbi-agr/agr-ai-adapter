# Use Node.js version 14 as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application code to the container
COPY . .

COPY env_local.txt .env

RUN npm install

# Build nest file
RUN npm run build

# Expose the port that the Nest.js application will run on
EXPOSE 3000

# Command to run the Nest.js application
CMD ["npm", "run", "start:prod"]