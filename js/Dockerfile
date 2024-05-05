FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN echo "set number" > ~/.vimrc
RUN echo "set incsearch" >> ~/.vimrc
WORKDIR /usr/app
RUN npm install esprima
RUN npm install express
RUN npm install multer
COPY main.js /usr/app/main.js
EXPOSE 3000
CMD ["node", "main.js"]