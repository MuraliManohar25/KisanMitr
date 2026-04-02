<<<<<<< HEAD
=======
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000 

CMD serve -s dist -l $PORT
>>>>>>> 6fef4765260a32ff0c411ecc4bc506f64fc68d7a
