# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json para cache de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --omit=dev

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["node", "server.js"]
