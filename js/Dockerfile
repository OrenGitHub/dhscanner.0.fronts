FROM node:lts-iron
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
RUN npm install winston
COPY main.js /usr/app/main.js
EXPOSE 3000
CMD ["node", "main.js"]