<?php

namespace App\Http\Requests;

use App\Rules\CpfValido;
use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        if ($this->has('cpf')) {
            $this->merge([
                'cpf' => preg_replace('/\D/', '', $this->input('cpf')),
            ]);
        }
    }

    public function rules(): array
    {
        $cpfRules = [
            'required',
            'string',
            'size:11',
            'regex:/^[0-9]+$/',
            'unique:usuarios,cpf',
        ];

        if (config('features.validar_cpf')) {
            $cpfRules[] = new CpfValido();
        }

        return [
            'nome'  => 'required|string|max:80',
            'cpf'   => $cpfRules,
            'email' => 'required|email|unique:usuarios,email',
            'senha' => 'required|string|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'cpf.unique'   => 'Este CPF já está cadastrado.',
            'email.unique' => 'Este e-mail já está em uso.',
            'cpf.size'     => 'O CPF deve conter exatamente 11 dígitos.',
            'cpf.regex'    => 'O CPF deve conter apenas números.',
        ];
    }
}