FROM node:20-alpine AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.js ./
COPY public ./public
RUN npm run build

FROM php:8.2-cli
RUN apt-get update && apt-get install -y git unzip libzip-dev libpng-dev libfreetype6-dev libjpeg-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd intl bcmath \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .
COPY --from=assets /app/public/build ./public/build
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 10000
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
