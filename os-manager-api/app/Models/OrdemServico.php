<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; //IMportação pro uuid
use Illuminate\Support\Facades\Cache; // Importação para cache
use OwenIt\Auditing\Contracts\Auditable;

class OrdemServico extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'core.ordem_servicos'; 

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    protected $fillable = [
        'titulo',
        'descricao',
        'status_id',
        'urgencia_id',
        'prioridade_id',
        'categoria_id',
        'localizacao',
        'solucao',
        'usuario_id',
        'tecnico_id',
        'ativo',
        'motivo_pausa',
        'pausado_em',
        'tempo_pausado_minutos',
        'codigo_rastreio', 
    ];

    // Carrega os objetos relacionados automaticamente (Evita N+1 queries)
    protected $with = ['status', 'categoria', 'urgencia', 'prioridade']; 

    protected $appends = [
        'status_sla', 
        'status_nome', 
        'urgencia_nome', 
        'prioridade_nome', 
        'categoria_nome'
    ];

    /**
     * ==========================================
     * BOOTED 
     * ==========================================
     */
    protected static function booted()
    {
        static::creating(function ($os) {
            if (empty($os->codigo_rastreio)) {
                $os->codigo_rastreio = (string) Str::uuid();
            }
        });
    }

    /**
     * ==========================================
     * ROUTE MODEL BINDING 
     * ==========================================
     */
    public function getRouteKeyName()
    {
        return 'codigo_rastreio';
    }

    // ==========================================
    // RELAÇÕES
    // ==========================================

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function urgencia()
    {
        return $this->belongsTo(Urgencia::class, 'urgencia_id');
    }

    public function prioridade()
    {
        return $this->belongsTo(Prioridade::class, 'prioridade_id');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function tecnico()
    {
        return $this->belongsTo(User::class, 'tecnico_id');
    }

    public function historicos()
    {
        return $this->hasMany(HistoricoOs::class, 'ordem_servico_id')
                    ->orderBy('criado_em', 'desc');
    }

    // ==========================================
    // ACCESSORS
    // ==========================================

    public function getStatusNomeAttribute() { return $this->status?->nome; }
    public function getUrgenciaNomeAttribute() { return $this->urgencia?->nome; }
    public function getPrioridadeNomeAttribute() { return $this->prioridade?->nome; }
    public function getCategoriaNomeAttribute() { return $this->categoria?->nome; }

    // ==========================================
    // STATUS SLA 
    // ==========================================

    public function getStatusSlaAttribute()
    {
        $statusId = $this->status_id;
        $urgenciaId = $this->urgencia_id;

        // Tempo de cache em segundos (86400 = 24 horas)
        $ttl = 86400; 

        // Busca os IDs dinamicamente no banco, mas salva na memória RAM para não travar o sistema
        $idFechado = Cache::remember('id_status_fechado', $ttl, function () {
            return Status::where('nome', 'Fechado')->value('id');
        });

        $idsPausados = Cache::remember('ids_status_pausados', $ttl, function () {
            return Status::whereIn('nome', ['Pausado', 'Aguardando Peça'])->pluck('id')->toArray();
        });

        if ($statusId === $idFechado) return null;
        if (in_array($statusId, $idsPausados)) return 'pausado';

        // Busca dinâmica dos IDs de Urgência
        $idMuitoAlta = Cache::remember('id_urg_muito_alta', $ttl, fn() => Urgencia::where('nome', 'Muito Alta')->value('id'));
        $idAlta      = Cache::remember('id_urg_alta', $ttl, fn() => Urgencia::where('nome', 'Alta')->value('id'));
        $idMedia     = Cache::remember('id_urg_media', $ttl, fn() => Urgencia::where('nome', 'Média')->value('id'));
        $idBaixa     = Cache::remember('id_urg_baixa', $ttl, fn() => Urgencia::where('nome', 'Baixa')->value('id'));

        $limitesSla = [
            $idMuitoAlta => 2,
            $idAlta      => 4,
            $idMedia     => 8,
            $idBaixa     => 24,
        ];

        $limiteHoras = $limitesSla[$urgenciaId] ?? null;
        if (!$limiteHoras) return null;

        $limiteMinutos = $limiteHoras * 60;
        
        $minutosCorridos = now()->diffInMinutes($this->criado_em);
        $minutosReais = $minutosCorridos - ($this->tempo_pausado_minutos ?? 0);

        if ($limiteMinutos <= 0) return 'vencido'; 

        $porcentagem = $minutosReais / $limiteMinutos;

        if ($porcentagem >= 1) return 'vencido';
        if ($porcentagem >= 0.75) return 'alerta';

        return 'ok';
    }
}