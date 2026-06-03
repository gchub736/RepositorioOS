<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidaCpf implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $validacaoAtiva = filter_var(env('VALIDAR_CPF', true), FILTER_VALIDATE_BOOLEAN);

        if (!$validacaoAtiva) {
            return;
        }

        // Extrai somente os números
        $c = preg_replace('/\D/', '', $value);

        // Verifica se tem 11 dígitos ou se todos os dígitos são iguais
        if (strlen($c) != 11 || preg_match("/^{$c[0]}{11}$/", $c)) {
            $fail('CPF inválido.');
            return;
        }

        // Valida o primeiro dígito verificador
        for ($s = 10, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
        if ($c[9] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
            $fail('CPF inválido.');
            return;
        }

        // Valida o segundo dígito verificador
        for ($s = 11, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
        if ($c[10] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
            $fail('CPF inválido.');
            return;
        }
    }
}
