# Build stage
FROM node:lts-alpine as builder
WORKDIR /usr/app
# Versions are pinned deliberately. Every `npm install X` without a
# version tag pulls whatever is @latest at build time, so a clean-cache
# rebuild days later can pick up a different {typescript, @types/*,
# express, multer} matrix than the one that last worked and mysteriously
# fail. In particular, recent `typescript` releases have shipped a
# broken package.json `exports` map that resolves `import * as ts from
# "typescript"` to `typescript/lib/version` (just the version string
# constant) instead of `typescript/lib/typescript` (the compiler API),
# which is what caused the fresh-build breakage we hit here.
RUN npm install esprima@4.0.1
RUN npm install express@4.19.2
RUN npm install multer@1.4.5-lts.1
RUN npm install typescript@5.4.5
RUN npm install @types/node@20.11.30
RUN npm install @types/express@4.17.21
RUN npm install @types/multer@1.4.11
COPY . .

# Compile TypeScript
RUN npx tsc --esModuleInterop --module commonjs index.ts parser.ts

# Production stage
FROM node:lts-alpine
WORKDIR /usr/app
COPY --from=builder /usr/app ./
EXPOSE 3000
CMD ["node", "index.js"]