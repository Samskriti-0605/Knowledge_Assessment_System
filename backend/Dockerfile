# Use the official PHP 8.2 Apache image
FROM php:8.2-apache

# Install required system packages and PHP extensions
# We add libmariadb-dev to ensure the MySQL drivers compile correctly
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libmariadb-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli zip

# Enable Apache mod_rewrite required for our .htaccess router rules
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Copy all application files to the container
COPY . /var/www/html/

# Update the default apache site configuration to allow .htaccess overrides
ENV APACHE_DOCUMENT_ROOT /var/www/html

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Fix permissions so Apache can serve and modify files if needed
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
