#!/bin/sh
# Sobe o `next dev` e, assim que o servidor responder, pré-compila todas as
# rotas em segundo plano (requests HTTP simples). Sem isso, o Turbopack só
# compila cada rota na primeira vez que alguém navega até ela — e essa
# compilação a frio (vários segundos) trava a UI bem no clique do menu.
# Pré-aquecendo aqui, quando o usuário chega a clicar a rota já está pronta.

ROTAS="/ /login /novo /usuarios /estatisticas /configuracoes"

(
  until curl -s -o /dev/null "http://localhost:3000/login"; do
    sleep 1
  done
  for rota in $ROTAS; do
    curl -s -o /dev/null "http://localhost:3000${rota}"
  done
) &

exec npm run dev
