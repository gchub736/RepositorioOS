<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Se a checagem já é feita no middleware, pode deixar true
    }

    public function rules(): array
    {
        return [
            'nome'  => ['required', 'string', 'max:80'],
            'cpf'   => ['required', 'string', 'size:11', Rule::unique(User::class, 'cpf')],
            'email' => ['required', 'email', Rule::unique(User::class, 'email')],
            'senha' => ['required', 'string', 'min:4'],
        ];
    }

    public function messages(): array
    {
        return [
            'cpf.unique'   => 'Este CPF já está cadastrado.',
            'email.unique' => 'Este e-mail já está em uso.',
            'cpf.size'     => 'O CPF deve conter exatamente 11 dígitos.',
        ];
    }
}