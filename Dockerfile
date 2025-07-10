# Use the official Node.js image
FROM node:18 AS builder

# Install system dependencies required for bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    g++ \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --build-from-source

# Copy the rest of the app's files into the container
COPY . .

# Production stage
FROM node:18
WORKDIR /app

# Copy files from the builder
COPY --from=builder /app .

# Remove dev dependencies
RUN npm prune --production

# Expose the app's port
EXPOSE 8002

# Start the application
CMD ["npm", "start"]
