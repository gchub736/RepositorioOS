#!/bin/sh

cd /var/www

echo "Aguardando banco subir..."
sleep 5

php artisan migrate --force

php artisan serve --host=0.0.0.0 --port=8000