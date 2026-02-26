<?php

namespace App\Http\Controllers;

use App\Models\OrdemServico;
use Illuminate\Http\Request;

class OrdemServicoController extends Controller
{
    public function index()
    {
        // Retorna ordens com os dados do técnico para evitar tela branca
        return OrdemServico::with('usuario')->orderBy('created_at', 'desc')->get();
    }

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

    public function show($id)
    {
        return OrdemServico::with('usuario')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = OrdemServico::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load('usuario'), 200);
    }

    public function destroy($id)
    {
        OrdemServico::destroy($id);
        return response()->json(['message' => 'Excluído com sucesso'], 200);
    }
}