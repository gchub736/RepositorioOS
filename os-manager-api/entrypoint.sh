#!/bin/sh

# Espera o banco estar pronto
echo "Aguardando banco subir..."

# Usa netcat para checar porta
until nc -z db 5432; do
  echo "Banco ainda não disponível, aguardando..."
  sleep 2
done

echo "Banco disponível!"

# Instala dependências se necessário
if [ ! -d "vendor" ]; then
  echo "Instalando dependências do Composer..."
  composer install --no-interaction --optimize-autoloader
fi

# Roda migrations
php artisan migrate --force

# Sobe o servidor
php artisan serve --host=0.0.0.0 --port=8000