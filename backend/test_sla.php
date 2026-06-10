<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$os = \App\Models\OrdemServico::find(114);
if (!$os) {
    echo "OS 114 not found\n";
    exit;
}

echo "Criado em: " . $os->criado_em . "\n";
echo "Tempo pausado (min): " . $os->tempo_pausado_minutos . "\n";
echo "Urgencia: " . $os->urgencia_nome . "\n";

$limitesSla = \App\Models\Configuracao::slaLimites();
echo "Limites: " . json_encode($limitesSla) . "\n";

$limiteHoras = $limitesSla[$os->urgencia_nome] ?? null;
echo "Limite Horas: " . $limiteHoras . "\n";

$minutosCorridos = now()->diffInMinutes($os->criado_em);
echo "Minutos Corridos: " . $minutosCorridos . "\n";

$minutosReais = $minutosCorridos - ($os->tempo_pausado_minutos ?? 0);
echo "Minutos Reais: " . $minutosReais . "\n";

$limiteMinutos = $limiteHoras * 60;
echo "Limite Minutos: " . $limiteMinutos . "\n";

$porcentagem = $limiteMinutos > 0 ? $minutosReais / $limiteMinutos : 0;
echo "Porcentagem: " . $porcentagem . "\n";

echo "Status SLA: " . $os->status_sla . "\n";
