<?php
require __DIR__.'/vendor/autoload.php';

$criado_em = '2026-05-27 13:15:00';
$now = \Carbon\Carbon::parse('2026-06-10 13:10:00');

$minutosCorridos = $now->diffInMinutes($criado_em);
echo "Minutos Corridos (string): " . $minutosCorridos . "\n";

$minutosCorridosParsed = $now->diffInMinutes(\Carbon\Carbon::parse($criado_em));
echo "Minutos Corridos (parsed): " . $minutosCorridosParsed . "\n";

$minutosCorridosNow = \Carbon\Carbon::now()->diffInMinutes($criado_em);
echo "Minutos Corridos (now): " . $minutosCorridosNow . "\n";
