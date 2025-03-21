# Stage 1: Build the Angular app
FROM node:20 as build-stage

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Создаём production-сборку
RUN npm run build --configuration=production

# Stage 2: Run the app using Nginx
FROM nginx:stable-alpine

# Копируем собранное приложение из первого этапа в директорию Nginx
COPY --from=build-stage /app/dist/git-repos/browser/. /usr/share/nginx/html

# Копируем кастомный конфиг Nginx, если есть
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Стартуем Nginx
CMD ["nginx", "-g", "daemon off;"]