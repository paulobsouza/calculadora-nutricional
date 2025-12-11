# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build arguments para variáveis de ambiente
ARG VITE_API_URL
ARG VITE_USDA_API_KEY

# Build da aplicação
RUN npm run build

# Production stage - usar nginx para servir arquivos estáticos
FROM nginx:alpine

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build para nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
