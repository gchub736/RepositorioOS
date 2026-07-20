#!/bin/sh

# Espera o banco estar pronto para evitar erro de conexão na API
echo "Aguardando banco subir..."
until nc -z db 5432; do
  echo "Banco ainda não disponível, aguardando..."
  sleep 2
done

echo "Banco disponível!"

# Instala dependências se a pasta vendor não existir (útil para novos setups)
if [ ! -d "vendor" ]; then
  echo "Instalando dependências do Composer..."
  composer install --no-interaction --optimize-autoloader
fi

# Setup automático para clones limpos (o .env é ignorado no git). Tudo é idempotente:
# em ambientes que já estão configurados, nada é sobrescrito.
if [ ! -f ".env" ]; then
  echo "Criando .env a partir de .env.example..."
  cp .env.example .env
fi

if ! grep -q "^APP_KEY=base64:" .env; then
  echo "Gerando APP_KEY..."
  php artisan key:generate --force
fi

if ! grep -qE "^JWT_SECRET=.+" .env; then
  echo "Gerando JWT_SECRET..."
  php artisan jwt:secret --force
fi

# Inicia o scheduler do Laravel em background (executa backup diário, limpeza, etc.)
echo "Iniciando scheduler em background..."
php artisan schedule:work >> /var/www/storage/logs/scheduler.log 2>&1 &

# Sobe o servidor do Laravel
echo "Iniciando servidor da API..."
php artisan serve --host=0.0.0.0 --port=8000