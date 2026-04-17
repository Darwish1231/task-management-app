FROM node:20-alpine

# Set working directory inside the robust alpine container
WORKDIR /app

# Copy essential package configs to cache dependencies
COPY package*.json ./

# Install packages
RUN npm install --production

# Move structural backend architecture
COPY . .

# Server operates bound to 5001
EXPOSE 5001

CMD ["npm", "start"]
