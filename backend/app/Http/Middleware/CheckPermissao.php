<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissao 
{
    /**
     * Handle an incoming request.
     * O operador ... (variadic) transforma as permissões separadas por vírgula na rota em um array.
     */
    public function handle(Request $request, Closure $next, ...$permissoes): Response
    {
        // 1. Pega o usuário autenticado
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        // 2. Loop de verificação: Checa se ele tem PELO MENOS UMA das permissões exigidas
        $temAcesso = false;

        foreach ($permissoes as $permissao) {
            // Primeiro, verifica se o usuário tem a permissão nomeada
            if ($usuario->temPermissao($permissao)) {
                $temAcesso = true;
                break;
            }

            // Também aceita quando o parâmetro corresponde ao nome do cargo do usuário
            if ($usuario->cargo?->nome === $permissao) {
                $temAcesso = true;
                break;
            }
        }

        // 3. Se rodou tudo e ele não tem nenhuma das permissões exigidas, bloqueia o acesso
        if (!$temAcesso) {
            return response()->json([
                'message' => 'Acesso negado: Você não possui a permissão necessária para este recurso.'
            ], 403);
        }

        // Se passou na checagem, Libera para o Controller.
        return $next($request);
    }
}