<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Usuarios",
    description: "Endpoints para gerenciamento de usuários"
)]
class UsuarioController extends Controller
{
    #[OA\Get(
        path: "/api/usuarios",
        tags: ["Usuarios"],
        summary: "Lista todos os usuários",
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de usuários"
            )
        ]
    )]
    public function index()
    {
        return response()->json(User::all());
    }

    #[OA\Post(
        path: "/api/usuarios",
        tags: ["Usuarios"],
        summary: "Cria um novo usuário",
        responses: [
            new OA\Response(response: 201, description: "Usuário criado"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function store(Request $request)
    {
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
    }

    #[OA\Post(
        path: "/api/login",
        tags: ["Usuarios"],
        summary: "Login do usuário",
        responses: [
            new OA\Response(response: 200, description: "Login realizado"),
            new OA\Response(response: 401, description: "Credenciais inválidas")
        ]
    )]
    public function login(Request $request)
    {
        $usuario = User::where('cpf', $request->cpf)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        return response()->json($usuario);
    }
}