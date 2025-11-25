# Usa Node.js
FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código e compila
COPY . .
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Roda o servidor
CMD ["npm", "run", "start:prod"]