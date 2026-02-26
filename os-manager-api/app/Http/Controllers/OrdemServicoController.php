<?php

namespace App\Http\Controllers;

use App\Models\OrdemServico;
use Illuminate\Http\Request;

class OrdemServicoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/ordens",
     *     tags={"OrdensServico"},
     *     summary="Lista todas as ordens de serviço",
     *     @OA\Response(
     *         response=200,
     *         description="Ordens retornadas com sucesso",
     *         @OA\JsonContent(type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="titulo", type="string"),
     *                 @OA\Property(property="descricao", type="string"),
     *                 @OA\Property(property="usuario_id", type="integer"),
     *                 @OA\Property(property="prioridade", type="string"),
     *                 @OA\Property(property="urgencia", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return OrdemServico::with('usuario')->orderBy('created_at', 'desc')->get();
    }

    /**
     * @OA\Post(
     *     path="/api/ordens",
     *     tags={"OrdensServico"},
     *     summary="Cria uma nova ordem de serviço",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"titulo","descricao","usuario_id","prioridade","urgencia"},
     *             @OA\Property(property="titulo", type="string"),
     *             @OA\Property(property="descricao", type="string"),
     *             @OA\Property(property="usuario_id", type="integer"),
     *             @OA\Property(property="prioridade", type="string"),
     *             @OA\Property(property="urgencia", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Ordem criada com sucesso"),
     *     @OA\Response(response=400, description="Erro ao criar ordem")
     * )
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'titulo' => 'required|string',
                'descricao' => 'required|string',
                'usuario_id' => 'required|exists:usuarios,id',
                'prioridade' => 'required|string',
                'urgencia' => 'required|string',
            ]);

            $novaOrdem = OrdemServico::create($request->all());

            return response()->json($novaOrdem->load('usuario'), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao criar chamado',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/ordens/{id}",
     *     tags={"OrdensServico"},
     *     summary="Mostra detalhes de uma ordem de serviço",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da ordem",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Ordem retornada com sucesso"),
     *     @OA\Response(response=404, description="Ordem não encontrada")
     * )
     */
    public function show($id)
    {
        return OrdemServico::with('usuario')->findOrFail($id);
    }

    /**
     * @OA\Put(
     *     path="/api/ordens/{id}",
     *     tags={"OrdensServico"},
     *     summary="Atualiza uma ordem de serviço",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da ordem",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="titulo", type="string"),
     *             @OA\Property(property="descricao", type="string"),
     *             @OA\Property(property="usuario_id", type="integer"),
     *             @OA\Property(property="prioridade", type="string"),
     *             @OA\Property(property="urgencia", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Ordem atualizada com sucesso")
     * )
     */
    public function update(Request $request, $id)
    {
        $item = OrdemServico::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load('usuario'), 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/ordens/{id}",
     *     tags={"OrdensServico"},
     *     summary="Deleta uma ordem de serviço",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da ordem",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Ordem deletada com sucesso")
     * )
     */
    public function destroy($id)
    {
        OrdemServico::destroy($id);
        return response()->json(['message' => 'Excluído com sucesso'], 200);
    }
}