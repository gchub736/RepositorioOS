<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrdemServico;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    /** Períodos aceitos, em dias. 0 = todo o histórico. */
    private const PERIODOS_VALIDOS = [0, 7, 30, 90];

    #[OA\Get(
        path: "/api/dashboard/estatisticas",
        tags: ["Dashboard"],
        summary: "Retorna dados estatísticos do sistema",
        description: "Acesso restrito: Apenas usuários com permissão 'dashboard.visualizar' ou cargo Admin. " .
            "Aceita o filtro opcional `periodo` (em dias) que recorta as métricas pelos chamados criados no intervalo.",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "periodo",
                in: "query",
                description: "Recorte das métricas em dias (chamados criados no período). Use 0 para todo o histórico.",
                required: false,
                schema: new OA\Schema(type: "integer", enum: [0, 7, 30, 90], default: 0)
            )
        ],
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
                                new OA\Property(property: "periodo", type: "integer", description: "Período aplicado, em dias (0 = tudo)"),
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
                                new OA\Property(
                                    property: "tempo_medio_resolucao",
                                    type: "object",
                                    description: "Tempo médio entre a abertura e o fechamento, descontando o tempo pausado.",
                                    properties: [
                                        new OA\Property(property: "horas", type: "number", nullable: true, description: "Média em horas (null se não houver amostra)"),
                                        new OA\Property(property: "amostra", type: "integer", description: "Quantidade de chamados fechados considerados")
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
            new OA\Response(response: 401, description: "Não autenticado"),
            new OA\Response(response: 403, description: "Acesso negado"),
            new OA\Response(response: 422, description: "Período inválido")
        ]
    )]
    public function estatisticas(Request $request)
    {
        $validado = $request->validate([
            'periodo' => ['sometimes', 'integer', Rule::in(self::PERIODOS_VALIDOS)],
        ]);

        $periodo = (int) ($validado['periodo'] ?? 0);
        $desde = $periodo > 0 ? now()->subDays($periodo) : null;

        // Aplica o recorte de período (por data de criação) em uma query Eloquent.
        $noPeriodo = fn($query) => $desde ? $query->where('criado_em', '>=', $desde) : $query;

        // Totais base
        $totalAtivos = $noPeriodo(OrdemServico::where('ativo', true))->count();

        $resolvidos = $noPeriodo(
            OrdemServico::where('ativo', true)
                ->whereHas('status', fn($q) => $q->where('nome', 'Fechado'))
        )->count();

        $abertos = $noPeriodo(
            OrdemServico::where('ativo', true)
                ->whereHas('status', fn($q) => $q->whereIn('nome', ['Novo', 'Em Andamento', 'Pausado']))
        )->count();

        $semTecnico = $noPeriodo(
            OrdemServico::where('ativo', true)
                ->whereNull('tecnico_id')
                ->whereHas('status', fn($q) => $q->where('nome', '!=', 'Fechado'))
        )->count();

        // 5 técnicos com mais OS resolvidas (Fechado)
        $topTecnicos = $noPeriodo(
            OrdemServico::select('tecnico_id', DB::raw('count(*) as resolvidos'))
                ->with('tecnico:id,nome')
                ->where('ativo', true)
                ->whereHas('status', fn($q) => $q->where('nome', 'Fechado'))
                ->whereNotNull('tecnico_id')
        )
            ->groupBy('tecnico_id')
            ->orderBy('resolvidos', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->tecnico_id,
                'nome' => $item->tecnico->nome ?? 'Desconhecido',
                'resolvidos' => (int) $item->resolvidos,
            ]);

        // Tempo médio de resolução (abertura -> fechamento, descontando pausas).
        $tempoMedio = $this->tempoMedioResolucao($desde);

        $categoriasQuery = DB::table('ordem_servicos as os')
            ->join('categoria as c', 'os.categoria_id', '=', 'c.id')
            ->join('status as s', 'os.status_id', '=', 's.id')
            ->select(
                'c.nome as categoria',
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN s.nome != 'Fechado' THEN 1 ELSE 0 END) as abertos"),
                DB::raw("SUM(CASE WHEN s.nome = 'Fechado' THEN 1 ELSE 0 END) as resolvidos")
            )
            ->where('os.ativo', true);

        if ($desde) {
            $categoriasQuery->where('os.criado_em', '>=', $desde);
        }

        $categorias = $categoriasQuery->groupBy('c.nome')->get();

        $prioridadesQuery = DB::table('ordem_servicos as os')
            ->join('prioridade as p', 'os.prioridade_id', '=', 'p.id')
            ->join('status as s', 'os.status_id', '=', 's.id')
            ->select(
                'p.nome as prioridade',
                DB::raw("SUM(CASE WHEN s.nome != 'Fechado' THEN 1 ELSE 0 END) as abertos")
            )
            ->where('os.ativo', true)
            ->where('s.nome', '!=', 'Fechado');

        if ($desde) {
            $prioridadesQuery->where('os.criado_em', '>=', $desde);
        }

        $prioridades = $prioridadesQuery->groupBy('p.id', 'p.nome')->orderBy('p.id', 'desc')->get();

        // Saúde do SLA (apenas chamados ativos/não encerrados)
        $abertosSla = $noPeriodo(
            OrdemServico::with(['status', 'urgencia'])
                ->where('ativo', true)
                ->whereHas('status', fn($q) => $q->whereNotIn('nome', ['Fechado', 'Cancelado']))
        )->get();

        $slaStats = ['ok' => 0, 'alerta' => 0, 'vencido' => 0];
        foreach ($abertosSla as $os) {
            $statusSla = $os->status_sla;
            if (isset($slaStats[$statusSla])) {
                $slaStats[$statusSla]++;
            }
        }

        return response()->json([
            'data' => [
                'periodo' => $periodo,
                'geral' => [
                    'total' => $totalAtivos,
                    'resolvidos' => $resolvidos,
                    'abertos' => $abertos,
                    'sem_tecnico' => $semTecnico,
                    'perc_resolvidos' => $totalAtivos > 0 ? round(($resolvidos / $totalAtivos) * 100, 2) : 0,
                ],
                'sla' => $slaStats,
                'tempo_medio_resolucao' => $tempoMedio,
                'top_tecnicos' => $topTecnicos,
                'categorias' => $categorias,
                'prioridades' => $prioridades,
            ],
            'message' => 'Estatísticas recuperadas com sucesso'
        ]);
    }

    /**
     * Média de (fechado_em - criado_em) menos o tempo pausado, em horas.
     * Considera apenas OS fechadas que possuem carimbo de fechamento.
     */
    private function tempoMedioResolucao(?\Illuminate\Support\Carbon $desde): array
    {
        $query = DB::table('ordem_servicos as os')
            ->join('status as s', 'os.status_id', '=', 's.id')
            ->where('os.ativo', true)
            ->where('s.nome', 'Fechado')
            ->whereNotNull('os.fechado_em');

        if ($desde) {
            $query->where('os.criado_em', '>=', $desde);
        }

        // GREATEST(...,0) evita média negativa caso o tempo pausado exceda o total.
        $resultado = $query->selectRaw("
            COUNT(*) as amostra,
            AVG(
                GREATEST(
                    EXTRACT(EPOCH FROM (os.fechado_em - os.criado_em)) / 3600.0
                    - (COALESCE(os.tempo_pausado_minutos, 0) / 60.0),
                    0
                )
            ) as media_horas
        ")->first();

        $amostra = (int) ($resultado->amostra ?? 0);

        return [
            'horas' => $amostra > 0 && $resultado->media_horas !== null
                ? round((float) $resultado->media_horas, 1)
                : null,
            'amostra' => $amostra,
        ];
    }
}
