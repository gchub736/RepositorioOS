<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use OwenIt\Auditing\Contracts\Auditable; // 1. Importa a Interface da Auditoria
use Illuminate\Support\Facades\Cache; // Importa o Cache para a busca dinâmica do Admin

class User extends Authenticatable implements JWTSubject, Auditable // 2. Implementa a Interface
{
    use HasFactory, Notifiable;
    use \OwenIt\Auditing\Auditable; // 3. Usa a Trait da Auditoria

    protected $table = 'gestoes.usuarios';

    /**
     * ==========================================
     * AUDITORIA: PROTEÇÃO DE DADOS
     * ==========================================
     * Os campos abaixo não serão registrados no log (core.audits) caso sejam alterados.
     */
    protected $auditExclude = [
        'senha',
        'remember_token',
    ];

    protected $fillable = [
        'nome',
        'cpf',
        'email',
        'senha',
        'cargo_id', 
        'ativo',
    ];

    protected $hidden = [
        'senha',
        'remember_token',
    ];

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    public function getAuthPassword()
    {
        return $this->senha;
    }

    protected function casts(): array
    {
        return [
            'senha' => 'hashed',
            'ativo' => 'boolean',
        ];
    }

    // ==========================================
    // RELACIONAMENTOS COM ORDEM DE SERVIÇO
    // ==========================================
    public function ordensSolicitadas()
    {
        return $this->hasMany(OrdemServico::class, 'usuario_id')
                    ->orderBy('criado_em', 'desc');
    }

    
    public function ordensTecnico()
    {
        return $this->hasMany(OrdemServico::class, 'tecnico_id')
                    ->orderBy('criado_em', 'desc');
    }

    // ==========================================
    // GESTÃO DE ACESSOS
    // ==========================================

    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'cargo_id');
    }

    public function permissoesEspecificas()
    {
        return $this->belongsToMany(
            Permissao::class, 
            'gestoes.usuario_permissoes', 
            'usuario_id', 
            'permissao_id'
        );
    }

    /**
     * Verifica permissão com hierarquia (Admin > Específica > Cargo)
     */
    public function temPermissao(string $nomePermissao): bool
    {
        // Zero Hardcode e Alta Performance usando Cache (Dura 24h = 86400s)
        $idAdmin = Cache::remember('id_cargo_admin', 86400, function () {
            return Cargo::where('nome', 'Admin')->value('id');
        });

        // 1. Admin
        if ($this->cargo_id === $idAdmin) {
            return true;
        }

        // 2. Permissão Específica (Individual)
        if ($this->permissoesEspecificas()->where('nome', $nomePermissao)->exists()) {
            return true;
        }

        // 3. Permissão via Cargo
        return $this->cargo ? $this->cargo->permissoes()->where('nome', $nomePermissao)->exists() : false;
    }

    // ==========================================
    // MÉTODOS JWT
    // ==========================================

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'nome'  => $this->nome,
            'cargo' => $this->cargo?->nome
        ];
    }
}