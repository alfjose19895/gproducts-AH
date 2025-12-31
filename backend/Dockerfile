# Stage 1: Builder - Instalar dependencias y Composer
FROM php:8.2-fpm-alpine AS php_dev_builder

RUN apk add --no-cache \
    bash \
    icu-dev \
    libzip-dev \
    git \
    unzip \
    mysql-client # Cliente MySQL para PDO

RUN docker-php-ext-install \
    intl \
    pdo_mysql \
    zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/bin/symfony

WORKDIR /var/www/html

# Stage 2: Final image - Menos herramientas, más ligero para producción (opcional)
FROM php_dev_builder AS php_dev

# Copiar el WORKDIR para mantener las instalaciones
WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
