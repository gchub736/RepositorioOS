<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdemServicoController;
use App\Http\Controllers\UsuarioController;

// Rota para cadastrar novo técnico 
Route::post('/usuarios', [UsuarioController::class, 'store']);

// Rota para realizar o login
Route::post('/login', [UsuarioController::class, 'login']);

// Rota para listar técnicos 
Route::get('/usuarios', [UsuarioController::class, 'index']);

Route::apiResource('ordens', OrdemServicoController::class);