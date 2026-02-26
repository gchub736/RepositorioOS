<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validação rigorosa
            $request->validate([
                'nome'  => 'required|string|max:255',
                'cpf'   => 'required|string|unique:usuarios,cpf',
                'senha' => 'required|string|min:4',
            ]);

            $usuario = User::create([
                'nome'  => $request->nome,
                'cpf'   => $request->cpf,
                'senha' => Hash::make($request->senha),
                'cargo' => 'Tecnico',
            ]);

            return response()->json($usuario, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Erro ao cadastrar: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $usuario = User::where('cpf', $request->cpf)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        return response()->json($usuario);
    }

    public function index()
    {
        return response()->json(User::all());
    }
}