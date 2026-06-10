<?php
require __DIR__.'/vendor/autoload.php';

$criado_em = '2026-05-27 13:15:00';
$now = \Carbon\Carbon::parse('2026-06-10 13:10:00');

echo "diffInMinutes absolute true: " . $now->diffInMinutes($criado_em, true) . "\n";
echo "abs(): " . abs($now->diffInMinutes($criado_em)) . "\n";
