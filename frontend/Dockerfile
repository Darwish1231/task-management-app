# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage utilizing optimized NGINX
FROM nginx:alpine
# Copy compiled custom UI assets
COPY --from=build /app/dist /usr/share/nginx/html
# Note: Nginx defaults to 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
