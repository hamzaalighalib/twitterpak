# Use a stable Node.js version
FROM node:20-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies (this avoids the 'npm ci' lockfile issue)
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your server uses
EXPOSE 3000

# Set environment variable to ensure it listens on the correct port
ENV PORT=3000

# Command to run your app
CMD [ "node", "index.js" ]
