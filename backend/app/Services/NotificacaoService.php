<?php

namespace App\Services;

use App\Models\Notificacao;
use App\Models\OrdemServico;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificacaoService
{
    public static function notificarAtribuicao(OrdemServico $ordem, ?int $tecnicoAnteriorId): void
    {
        $novoTecnicoId = $ordem->tecnico_id ? (int) $ordem->tecnico_id : null;

        if (!$novoTecnicoId || (int) $tecnicoAnteriorId === $novoTecnicoId) {
            return;
        }

        self::criar([
            'usuario_id' => $novoTecnicoId,
            'ordem_servico_id' => $ordem->id,
            'titulo' => 'Nova OS atribuída',
            'mensagem' => "Você foi atribuído à ordem de serviço #{$ordem->id}: '{$ordem->titulo}'",
        ]);
    }

    public static function notificarComentario(OrdemServico $ordem, User $autor): void
    {
        $ordem->refresh();

        $autorId = (int) $autor->id;
        $donoId = (int) $ordem->usuario_id;
        $tecnicoId = $ordem->tecnico_id ? (int) $ordem->tecnico_id : null;
        $autorCargo = is_string($autor->cargo) ? $autor->cargo : ($autor->cargo?->nome ?? '');

        if ($donoId !== $autorId) {
            self::criar([
                'usuario_id' => $donoId,
                'ordem_servico_id' => $ordem->id,
                'titulo' => 'Nova mensagem no chamado',
                'mensagem' => "{$autor->nome} respondeu no seu chamado #{$ordem->id}: '{$ordem->titulo}'.",
            ]);
        }

        if ($tecnicoId && $tecnicoId !== $autorId) {
            self::criar([
                'usuario_id' => $tecnicoId,
                'ordem_servico_id' => $ordem->id,
                'titulo' => 'Nova mensagem no chamado',
                'mensagem' => "{$autor->nome} comentou no chamado #{$ordem->id} que você está acompanhando.",
            ]);
        }

        if ($autorCargo === 'Usuario' && !$tecnicoId) {
            $destinatarios = User::query()
                ->where('ativo', true)
                ->where('id', '!=', $autorId)
                ->whereHas('cargo', fn ($q) => $q->whereIn('nome', ['Admin', 'Tecnico']))
                ->pluck('id');

            foreach ($destinatarios as $destinatarioId) {
                self::criar([
                    'usuario_id' => (int) $destinatarioId,
                    'ordem_servico_id' => $ordem->id,
                    'titulo' => 'Nova mensagem no chamado',
                    'mensagem' => "{$autor->nome} enviou uma mensagem no chamado #{$ordem->id}: '{$ordem->titulo}'.",
                ]);
            }
        }
    }

    private static function criar(array $dados): void
    {
        try {
            Notificacao::create(array_merge($dados, [
                'lida' => false,
                'criado_em' => now(),
            ]));
        } catch (\Throwable $e) {
            Log::error('Falha ao criar notificação: ' . $e->getMessage(), $dados);
        }
    }
}
