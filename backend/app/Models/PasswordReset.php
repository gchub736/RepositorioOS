<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Token de recuperação de senha.
 *
 * O token é de uso único (removido após redefinir a senha) e expira em
 * MINUTOS_VALIDADE minutos. Usado pelo PasswordResetController.
 */
class PasswordReset extends Model
{
    protected $table = 'gestoes.password_resets';

    public $timestamps = false;

    /** Tempo de validade do token, em minutos. */
    public const MINUTOS_VALIDADE = 60;

    protected $fillable = [
        'cpf',
        'token',
        'criado_em',
    ];

    protected $casts = [
        'criado_em' => 'datetime',
    ];

    /**
     * Indica se o token já passou do prazo de validade.
     */
    public function expirou(): bool
    {
        if (!$this->criado_em) {
            return true;
        }

        return $this->criado_em->lt(now()->subMinutes(self::MINUTOS_VALIDADE));
    }
}
