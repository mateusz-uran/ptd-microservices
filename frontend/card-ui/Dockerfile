FROM node:slim
WORKDIR /frontend/card-ui
ENV PATH /frontend/card-ui/node_modules/.bin:$PATH
COPY package.json .
COPY package-lock.json .
RUN npm install # -g npm@8.9.0
COPY . .
EXPOSE 3000
CMD ["npm", "start"]