# Usa una imagen de Node.js para construir la aplicación
FROM node:20.16.0 AS build
WORKDIR /app

# Copia los archivos necesarios e instala las dependencias
COPY package*.json ./
RUN npm install
COPY . .

# Construye la aplicación en modo producción
RUN npm run build --prod

# Usa una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine
COPY --from=build /app/dist/TuProyectoAngular /usr/share/nginx/html

# Exponer el puerto 80 para el tráfico HTTP
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
