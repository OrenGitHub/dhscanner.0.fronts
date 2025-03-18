# Build stage
FROM node:lts-alpine as builder
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
RUN npm install typescript
RUN npm install @types/node
COPY . .

# Compile TypeScript
RUN npx tsc index.ts

# Production stage
FROM node:lts-alpine
WORKDIR /usr/app
COPY --from=builder /usr/app ./
EXPOSE 3000
CMD ["node", "index.js"]