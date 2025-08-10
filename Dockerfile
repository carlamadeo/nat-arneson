# Frontend Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

# Build-time API base (can be overridden via --build-arg)
ARG VITE_API_BASE=http://localhost:3001
ENV VITE_API_BASE=$VITE_API_BASE

COPY package*.json ./
RUN npm ci || npm i

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["serve","-s","dist","-l","5173"]