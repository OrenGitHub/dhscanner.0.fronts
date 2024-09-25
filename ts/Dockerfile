FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN echo "set number" > ~/.vimrc
RUN echo "set incsearch" >> ~/.vimrc
RUN echo "syntax on" >> ~/.vimrc
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
RUN npm install typescript
RUN npm install ts-node
COPY . .
EXPOSE 3000
RUN npx tsc index.ts
CMD ["node", "index.js"]
