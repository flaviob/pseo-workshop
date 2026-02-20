FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN NODE_ENV=development npm ci

COPY . .
RUN NODE_ENV=production npm run build

EXPOSE 3000
CMD ["npm", "start"]
