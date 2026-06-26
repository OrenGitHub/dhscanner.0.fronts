# Tiny PHP front for dhscanner: nikic/PhpParser, served by PHP's built-in
# dev server. No Laravel, no routing library, no CSRF.
# The whole HTTP surface is index.php; see that file for the route list.
FROM php:8.4-cli

# `composer install` needs `unzip` to extract package archives (the official
# `composer` image ships it; the slim php:8.4-cli image does not). Keep the
# layer minimal -- no extensions, no other tooling.
RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /app

# Cache the composer install layer separately from the application code so
# that an edit to index.php doesn't reinstall the world.
COPY composer.json ./
RUN composer install --no-interaction --no-progress --prefer-dist --no-dev

COPY index.php ./

# PHP's built-in server is single-process by default; `PHP_CLI_SERVER_WORKERS`
# turns on a small worker pool so concurrent file uploads from
# `workers/native_parser` (asyncio.gather) don't serialize at the front.
ENV PHP_CLI_SERVER_WORKERS=4

EXPOSE 5000

# Document root and router are both /app/index.php: every request is routed
# through dispatch() in index.php, no static files served.
CMD ["php", "-S", "0.0.0.0:5000", "-t", "/app", "/app/index.php"]
