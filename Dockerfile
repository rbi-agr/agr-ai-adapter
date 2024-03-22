# Use Node.js version 14 as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

RUN npm install

# Copy the rest of the application code to the container
COPY . .

COPY .env_local .env

# Build nest file
RUN npm run build

# Expose the port that the Nest.js application will run on
EXPOSE 3080

# Command to run the Nest.js application
CMD ["npm", "run", "start:prod"]