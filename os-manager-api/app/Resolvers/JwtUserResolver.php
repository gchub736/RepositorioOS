<?php

namespace App\Resolvers;

use OwenIt\Auditing\Contracts\UserResolver;
use Illuminate\Support\Facades\Auth;

class JwtUserResolver implements UserResolver
{
    /**
     * Resolve o Usuário logado via token JWT.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public static function resolve()
    {
        // Verifica se existe um usuário logado usando o guard 'api' (padrão JWT do Laravel)
        if (Auth::guard('api')->check()) {
            return Auth::guard('api')->user();
        }

        // Se quiser ser redundante e checar o auth genérico também:
        if (Auth::check()) {
            return Auth::user();
        }

        // Retorna null se for uma alteração feita pelo sistema (ex: CRON Job, seeder)
        return null;
    }
}