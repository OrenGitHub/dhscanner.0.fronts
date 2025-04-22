FROM node:lts-slim
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
RUN npm install winston
RUN npm install @babel/core
RUN npm install @babel/preset-react
COPY main.js /usr/app/main.js
EXPOSE 3000
CMD ["node", "main.js"]