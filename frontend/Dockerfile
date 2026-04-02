FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g http-server

EXPOSE 3000

CMD ["sh", "-c", "http-server dist -p ${PORT:-3000} --proxy http://localhost:${PORT:-3000}?"]