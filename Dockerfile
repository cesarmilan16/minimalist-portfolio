# 1. Fase de Construcción: Genera los archivos estáticos
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Este comando crea la carpeta 'dist' (o 'out', verifica tu astro.config si cambiaste esto)
RUN npm run build 

# 2. Fase de Servidor: Sirve los archivos estáticos con NGINX
FROM nginx:alpine
# Copia la configuración de NGINX si tienes un archivo nginx.conf personalizado (Opcional)
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos de la fase de construcción a la ubicación de NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Puerto por defecto de NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]