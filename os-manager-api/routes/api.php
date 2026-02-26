<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdemServicoController;
use App\Http\Controllers\UsuarioController;

/*
|--------------------------------------------------------------------------
| Rotas de Usuários (Técnicos)
|--------------------------------------------------------------------------
*/

// Rota para cadastrar novo técnico (Tela: Novo Técnico)
Route::post('/usuarios', [UsuarioController::class, 'store']);

// Rota para realizar o login
Route::post('/login', [UsuarioController::class, 'login']);

// Rota para listar técnicos (usada na aba lateral esquerda)
Route::get('/usuarios', [UsuarioController::class, 'index']);


/*
|--------------------------------------------------------------------------
| Rotas de Ordens de Serviço
|--------------------------------------------------------------------------
*/

Route::apiResource('ordens', OrdemServicoController::class);