<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrdemServico;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: "/api/dashboard/estatisticas",
        tags: ["Dashboard"],
        summary: "Retorna dados estatísticos do sistema",
        description: "Acesso restrito: Apenas usuários com permissão 'dashboard.visualizar' ou cargo Admin.",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200, 
                description: "Estatísticas geradas com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(
                                    property: "geral",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "total", type: "integer"),
                                        new OA\Property(property: "resolvidos", type: "integer"),
                                        new OA\Property(property: "abertos", type: "integer"),
                                        new OA\Property(property: "sem_tecnico", type: "integer"),
                                        new OA\Property(property: "perc_resolvidos", type: "number")
                                    ]
                                ),
                                new OA\Property(
                                    property: "sla",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "ok", type: "integer"),
                                        new OA\Property(property: "alerta", type: "integer"),
                                        new OA\Property(property: "vencido", type: "integer")
                                    ]
                                ),
                                new OA\Property(property: "top_tecnicos", type: "array", items: new OA\Items(type: "object")),
                                new OA\Property(property: "categorias", type: "array", items: new OA\Items(type: "object")),
                                new OA\Property(property: "prioridades", type: "array", items: new OA\Items(type: "object"))
                            ]
                        ),
                        new OA\Property(property: "message", type: "string")
                    ]
                )
            ),
            new OA\Response(response: 403, description: "Acesso negado")
        ]
    )]
    public function estatisticas(Request $request)
    {
        // Totais base
        $totalAtivos = OrdemServico::where('ativo', true)->count();

        // Filtros baseados nos relacionamentos de status
        $resolvidos = OrdemServico::where('ativo', true)
            ->whereHas('status', fn($q) => $q->where('nome', 'Fechado'))
            ->count();

        $abertos = OrdemServico::where('ativo', true)
            ->whereHas('status', fn($q) => $q->whereIn('nome', ['Novo', 'Em Andamento', 'Pausado']))
            ->count();

        $semTecnico = OrdemServico::where('ativo', true)
            ->whereNull('tecnico_id')
            ->whereHas('status', fn($q) => $q->where('nome', '!=', 'Fechado'))
            ->count();

        //5 técnicos com mais OS resolvidas (Fechado)
        $topTecnicos = OrdemServico::select('tecnico_id', DB::raw('count(*) as resolvidos'))
            ->with('tecnico:id,nome')
            ->where('ativo', true)
            ->whereHas('status', fn($q) => $q->where('nome', 'Fechado'))
            ->whereNotNull('tecnico_id')
            ->groupBy('tecnico_id')
            ->orderBy('resolvidos', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->tecnico_id,
                'nome' => $item->tecnico->nome ?? 'Desconhecido',
                'resolvidos' => $item->resolvidos
            ]);

       $categorias = DB::table('ordem_servicos as os')
            ->join('categoria as c', 'os.categoria_id', '=', 'c.id')
            ->join('status as s', 'os.status_id', '=', 's.id')
            ->select(
                'c.nome as categoria',
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN s.nome != 'Fechado' THEN 1 ELSE 0 END) as abertos")
            )
            ->where('os.ativo', true)
            ->groupBy('c.nome')
            ->get();

        $prioridades = DB::table('ordem_servicos as os')
            ->join('prioridade as p', 'os.prioridade_id', '=', 'p.id')
            ->join('status as s', 'os.status_id', '=', 's.id')
            ->select(
                'p.nome as prioridade',
                DB::raw("SUM(CASE WHEN s.nome != 'Fechado' THEN 1 ELSE 0 END) as abertos")
            )
            ->where('os.ativo', true)
            ->where('s.nome', '!=', 'Fechado')
            ->groupBy('p.id', 'p.nome')
            ->orderBy('p.id', 'desc')
            ->get();

        // Calculo de Saúde do SLA
        $abertosSla = OrdemServico::with(['status', 'urgencia'])
            ->where('ativo', true)
            ->whereHas('status', fn($q) => $q->whereNotIn('nome', ['Fechado', 'Cancelado']))
            ->get();

        $slaStats = ['ok' => 0, 'alerta' => 0, 'vencido' => 0];
        foreach ($abertosSla as $os) {
            $statusSla = $os->status_sla;
            if (isset($slaStats[$statusSla])) {
                $slaStats[$statusSla]++;
            }
        }

        return response()->json([
            'data' => [
                'geral' => [
                    'total' => $totalAtivos,
                    'resolvidos' => $resolvidos,
                    'abertos' => $abertos,
                    'sem_tecnico' => $semTecnico,
                    'perc_resolvidos' => $totalAtivos > 0 ? round(($resolvidos / $totalAtivos) * 100, 2) : 0,
                ],
                'sla' => $slaStats,
                'top_tecnicos' => $topTecnicos,
                'categorias' => $categorias,
                'prioridades' => $prioridades
            ],
            'message' => 'Estatísticas recuperadas com sucesso'
        ]);
    }
}