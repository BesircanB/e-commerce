FROM node:18-alpine

WORKDIR /usr/src/app

# package.json ve package-lock.json kopyalanıp bağımlılıklar kuruluyor
COPY package*.json ./
RUN npm install --production

# Uygulama kodu
COPY . .

# Üretim ortamı değişkeni
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
