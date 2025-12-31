FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias primero para cachear capas
COPY package*.json ./

RUN npm install

COPY . .

# Vite por defecto usa el puerto 5173, pero lo mapearemos al 3000 para tu comodidad
EXPOSE 3000

# El flag --host es vital en Docker para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]