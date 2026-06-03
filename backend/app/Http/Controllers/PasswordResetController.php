<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordReset;
use App\Mail\RecuperarSenhaMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Senha", description: "Endpoints para recuperação de senha")]
class PasswordResetController extends Controller
{
    // Solicita recuperação de senha.
    // Gera token único, salva no banco e envia email com link de reset.
    // Resposta genérica para não revelar se o CPF existe.
    #[OA\Post(
        path: "/api/forgot-password",
        tags: ["Senha"],
        summary: "Solicita recuperação de senha via email",
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ["cpf"],
                properties: [
                    new OA\Property(property: "cpf", type: "string", example: "12345678901")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Solicitação processada"),
            new OA\Response(response: 422, description: "Erro de validação"),
            new OA\Response(response: 429, description: "Muitas tentativas")
        ]
    )]
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'cpf' => 'required|string|size:11',
        ]);

        $usuario = User::where('cpf', $request->cpf)
                       ->where('ativo', true)
                       ->first();

        // Resposta genérica (segurança: não revela se CPF existe)
        $mensagemSucesso = [
            'message' => 'Se o CPF estiver cadastrado, um e-mail de recuperação será enviado.'
        ];

        if (!$usuario || !$usuario->email) {
            return response()->json($mensagemSucesso);
        }

        // Remover tokens anteriores deste CPF
        PasswordReset::where('cpf', $request->cpf)->delete();

        // Gerar token seguro
        $token = hash('sha256', Str::random(64));

        PasswordReset::create([
            'cpf'       => $request->cpf,
            'token'     => $token,
            'criado_em' => now(),
        ]);

        // Montar URL de reset (aponta para o frontend)
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $resetUrl = "{$frontendUrl}/login/resetar-senha?token={$token}";

        // Enviar email
        Mail::to($usuario->email)->send(
            new RecuperarSenhaMail($resetUrl, $usuario->nome)
        );

        return response()->json($mensagemSucesso);
    }

    /**
     * Valida o token de recuperação (verifica se é válido e não expirou).
     */
    #[OA\Get(
        path: "/api/reset-password/validate",
        tags: ["Senha"],
        summary: "Valida se o token de recuperação é válido",
        parameters: [
            new OA\Parameter(
                name: "token",
                in: "query",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Token válido"),
            new OA\Response(response: 400, description: "Token inválido ou expirado")
        ]
    )]
    public function validateToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $reset = PasswordReset::where('token', $request->token)->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Token inválido ou já utilizado.'
            ], 400);
        }

        if ($reset->expirou()) {
            $reset->delete();
            return response()->json([
                'message' => 'Token expirado. Solicite uma nova recuperação de senha.'
            ], 400);
        }

        return response()->json([
            'message' => 'Token válido.',
            'valid'   => true,
        ]);
    }

    /**
     * Redefine a senha usando o token válido.
     * Token é de uso único e excluído após uso.
     */
    #[OA\Post(
        path: "/api/reset-password",
        tags: ["Senha"],
        summary: "Redefine a senha com o token de recuperação",
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ["token", "nova_senha", "nova_senha_confirmacao"],
                properties: [
                    new OA\Property(property: "token", type: "string"),
                    new OA\Property(property: "nova_senha", type: "string", example: "novaSenha123"),
                    new OA\Property(property: "nova_senha_confirmacao", type: "string", example: "novaSenha123")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Senha atualizada com sucesso"),
            new OA\Response(response: 400, description: "Token inválido ou expirado"),
            new OA\Response(response: 422, description: "Erro de validação")
        ]
    )]
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                  => 'required|string',
            'nova_senha'             => 'required|string|min:4',
            'nova_senha_confirmacao' => 'required|string|same:nova_senha',
        ], [
            'nova_senha.min'              => 'A senha deve ter no mínimo 4 caracteres.',
            'nova_senha_confirmacao.same' => 'As senhas não coincidem.',
        ]);

        $reset = PasswordReset::where('token', $request->token)->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Token inválido ou já utilizado.'
            ], 400);
        }

        if ($reset->expirou()) {
            $reset->delete();
            return response()->json([
                'message' => 'Token expirado. Solicite uma nova recuperação de senha.'
            ], 400);
        }

        // Buscar usuário pelo CPF
        $usuario = User::where('cpf', $reset->cpf)->first();

        if (!$usuario) {
            $reset->delete();
            return response()->json([
                'message' => 'Usuário não encontrado.'
            ], 400);
        }

        // Atualizar senha e invalidar sessão ativa
        $usuario->update([
            'senha'     => Hash::make($request->nova_senha),
            'jti_token' => null, // Invalida sessão ativa por segurança
        ]);

        // Deletar token (uso único)
        $reset->delete();

        // Limpar todos os tokens expirados do banco (limpeza oportuna)
        PasswordReset::where('criado_em', '<', now()->subMinutes(60))->delete();

        return response()->json([
            'message' => 'Senha redefinida com sucesso! Faça login com sua nova senha.'
        ]);
    }
}
