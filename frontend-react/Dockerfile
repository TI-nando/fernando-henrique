FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Roda em modo de desenvolvimento expondo para a rede (--host)
CMD ["npm", "run", "dev", "--", "--host"]