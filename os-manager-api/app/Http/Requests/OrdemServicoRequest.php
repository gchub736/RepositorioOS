<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; 
use App\Models\Status;
use App\Models\Categoria;
use App\Models\Urgencia;
use App\Models\Prioridade;
use App\Models\User; // Importação necessária para validar os IDs de usuários

class OrdemServicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Se a requisição for PUT ou PATCH (Atualizar Ordem)
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            return [
                'status_id'     => ['sometimes', 'nullable', 'integer', Rule::exists(Status::class, 'id')],
                'urgencia_id'   => ['sometimes', 'nullable', 'integer', Rule::exists(Urgencia::class, 'id')],
                'prioridade_id' => ['sometimes', 'nullable', 'integer', Rule::exists(Prioridade::class, 'id')],
                'tecnico_id'    => ['sometimes', 'nullable', 'integer', Rule::exists(User::class, 'id')],
                'motivo_pausa'  => ['sometimes', 'nullable', 'string', 'max:150'],
                'solucao'       => ['sometimes', 'nullable', 'string', 'max:500'],
            ];
        }

        // Se a requisição for POST (Criar Nova Ordem)
        return [
            'titulo'        => 'required|string|max:100',
            'descricao'     => 'required|string|max:200',
            'localizacao'   => 'required|string|max:120',
            'motivo_pausa'  => 'sometimes|nullable|string|max:150',
            'solucao'       => 'sometimes|nullable|string|max:500',
            
            'categoria'     => ['required', 'string', Rule::exists(Categoria::class, 'nome')],
            'status'        => ['sometimes', 'string', Rule::exists(Status::class, 'nome')],
            'urgencia'      => ['required', 'string', Rule::exists(Urgencia::class, 'nome')],
            'prioridade'    => ['required', 'string', Rule::exists(Prioridade::class, 'nome')],
            
            // Usando a classe Rule para o usuário ao invés do caminho bruto do banco
            'usuario_id'    => ['sometimes', 'nullable', 'integer', Rule::exists(User::class, 'id')],
            'tecnico_id'    => ['sometimes', 'nullable', 'integer', Rule::exists(User::class, 'id')],

            'status_id'     => ['sometimes', 'nullable', 'integer', Rule::exists(Status::class, 'id')],
            'categoria_id'  => ['required', 'integer', Rule::exists(Categoria::class, 'id')],
            'urgencia_id'   => ['required', 'integer', Rule::exists(Urgencia::class, 'id')],
            'prioridade_id' => ['required', 'integer', Rule::exists(Prioridade::class, 'id')],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Se a requisição for de atualização (PUT) e vier com os _ids direto,
        // não precisamos rodar a busca no banco por nome da categoria/status.
        $mergeData = [];

        // Só tenta converter a string em ID se a string realmente foi enviada!
        // Evita transformar um `status_id` válido em `null` acidentalmente.
        if ($this->has('status')) {
            $mergeData['status_id'] = $this->resolveId(Status::class, $this->status);
        }
        if ($this->has('categoria')) {
            $mergeData['categoria_id'] = $this->resolveId(Categoria::class, $this->categoria);
        }
        if ($this->has('urgencia')) {
            $mergeData['urgencia_id'] = $this->resolveId(Urgencia::class, $this->urgencia);
        }
        if ($this->has('prioridade')) {
            $mergeData['prioridade_id'] = $this->resolveId(Prioridade::class, $this->prioridade);
        }

        if (!empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    private function resolveId(string $model, ?string $value): ?int
    {
        return $value ? $model::where('nome', $value)->value('id') : null;
    }
}