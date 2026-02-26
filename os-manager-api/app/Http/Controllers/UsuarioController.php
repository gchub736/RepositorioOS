<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Usuarios",
 *     description="Endpoints para gerenciar usuários"
 * )
 */
class UsuarioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/usuarios",
     *     tags={"Usuarios"},
     *     summary="Lista todos os usuários",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuários",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/User"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json(User::all());
    }

    /**
     * @OA\Post(
     *     path="/api/usuarios",
     *     tags={"Usuarios"},
     *     summary="Cria um novo usuário",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome","cpf","senha"},
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="cpf", type="string"),
     *             @OA\Property(property="senha", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuário criado com sucesso",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(response=422, description="Erro de validação")
     * )
     */
    public function store(Request $request)
    {
        try {
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

    /**
     * @OA\Post(
     *     path="/api/login",
     *     tags={"Usuarios"},
     *     summary="Login do usuário",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"cpf","senha"},
     *             @OA\Property(property="cpf", type="string"),
     *             @OA\Property(property="senha", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Login realizado"),
     *     @OA\Response(response=401, description="Credenciais inválidas")
     * )
     */
    public function login(Request $request)
    {
        $usuario = User::where('cpf', $request->cpf)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        return response()->json($usuario);
    }
}