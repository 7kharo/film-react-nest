FROM node:20-alpine AS builder

ARG VITE_API_URL
ARG VITE_CDN_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN mkdir -p /dist && cp -r /app/dist/* /dist/

FROM alpine:latest

COPY --from=builder /dist /dist

CMD ["sleep", "infinity"]