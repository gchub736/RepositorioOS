<?php

return [
    // Ativa validação real de CPF por ambiente.
    // Em produção, deixe verdadeiro para validar CPF verdadeiro.
    // Em desenvolvimento/teste, pode ser definido como false para permitir CPFs fictícios.
    'validar_cpf' => env('VALIDAR_CPF', true),
];
