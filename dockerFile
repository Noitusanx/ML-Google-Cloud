FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV MODEL_URL="https://storage.googleapis.com/asclepius/submissions-model/model.json"
ENV PORT=8000
EXPOSE 8000
CMD [ "npm", "run", "start" ]