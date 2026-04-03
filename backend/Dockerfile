# Use a professional, pre-configured image that HAS all drivers pre-installed
FROM webdevops/php-apache:8.2

# Set working directory
WORKDIR /app

# The default web root in this image is /app, but we can set it to /var/www/html if needed.
# Let's stick to the /app default for this image.
# Copy all backend files
COPY . /app

# Fix permissions for the web server user
RUN chown -R application:application /app





# Set working directory
WORKDIR /var/www/html


# Copy all backend files
COPY . .

# Set Apache to allow .htaccess overrides
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/override.conf \
    && a2enconf override

# Fix permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
