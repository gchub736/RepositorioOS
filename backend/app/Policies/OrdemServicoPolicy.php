<?php

namespace App\Policies;

use App\Models\OrdemServico;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrdemServicoPolicy
{
    use HandlesAuthorization;

    /**
     * Intercepta todas as checagens. 
     * Se for Admin, o acesso é garantido instantaneamente.
     */
    public function before(User $user, $ability)
    {
        if ($user->cargo?->nome === 'Admin') {
            return true;
        }
    }

    /**
     * Determina se o usuário pode ver a listagem (index).
     */
    public function viewAny(User $user): bool
    {
        return $user->temPermissao('os.visualizar_tudo') || 
               $user->temPermissao('os.visualizar_propria');
    }

    /**
     * Determina se o usuário pode visualizar uma OS específica.
     */
    public function view(User $user, OrdemServico $os): bool
    {
        // Pode ver se tiver permissão geral
        if ($user->temPermissao('os.visualizar_tudo')) {
            return true;
        }

        // Ou se for o dono (solicitante) ou o técnico atribuído
        return $user->id === $os->usuario_id || $user->id === $os->tecnico_id;
    }

    /**
     * Determina se o usuário pode criar uma OS.
     */
    public function create(User $user): bool
    {
        return $user->temPermissao('os.criar');
    }

    /**
     * Determina se o usuário pode editar uma OS específica.
     */
    public function update(User $user, OrdemServico $os): bool
    {
        // Permite que Técnicos retomem ordens pausadas mesmo sem a permissão direta
        if ($user->cargo?->nome === 'Tecnico' && !empty($os->pausado_em)) {
            return true;
        }

        if (!$user->temPermissao('os.editar')) {
            return false;
        }

        // Regra para Técnicos: só editam o que está atribuído a eles
        if ($user->cargo?->nome === 'Tecnico') {
            // Técnico pode editar se for o técnico atribuído
            if ($user->id === $os->tecnico_id) {
                return true;
            }

            // Também permite que técnicos retomem ordens que estejam em estado de pausa
            // Aceita tanto por nome do status quanto por flag de pausa `pausado_em` para maior robustez
            if (!empty($os->pausado_em)) {
                return true;
            }

            $estadosPausa = ['Pausado', 'Aguardando Peça'];
            return in_array($os->status?->nome, $estadosPausa);
        }

        return true;
    }

    /**
     * Determina se o usuário pode deletar uma OS.
     */
    public function delete(User $user, OrdemServico $os): bool
    {
        return $user->temPermissao('os.deletar');
    }

    /**
     * Determina se o usuário pode fixar uma OS.
     */
    public function fixar(User $user, OrdemServico $os): bool
    {
        return $user->cargo?->nome === 'Admin' || $user->cargo?->nome === 'Tecnico';
    }
}