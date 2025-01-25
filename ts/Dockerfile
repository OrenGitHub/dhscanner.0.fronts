FROM node:lts-iron
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
RUN npm install typescript
RUN npm install @types/node
COPY . .
EXPOSE 3000
RUN npx tsc index.ts
CMD ["node", "index.js"]
