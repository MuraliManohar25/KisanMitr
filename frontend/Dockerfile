FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist --listen tcp://0.0.0.0:${PORT:-3000}"]