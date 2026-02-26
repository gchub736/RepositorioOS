<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdemServico extends Model
{
    use HasFactory;

    protected $table = 'ordem_servicos';

    protected $fillable = [
        'titulo', 
        'descricao', 
        'status', 
        'urgencia',
        'prioridade',
        'localizacao',
        'solucao',
        'usuario_id' 
    ];

    public function usuario()
    {
        // Vincula ao modelo unificado User [cite: 2026-02-11]
        return $this->belongsTo(User::class, 'usuario_id');
    }
}