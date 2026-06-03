<?php

$value = '04414426251';
$c = preg_replace('/\D/', '', $value);

if (strlen($c) != 11 || preg_match("/^{$c[0]}{11}$/", $c)) {
    echo "Fail 1\n";
    exit;
}

for ($s = 10, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
if ($c[9] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
    echo "Fail 2\n";
    exit;
}

for ($s = 11, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
if ($c[10] != ((($n %= 11) < 2) ? 0 : 11 - $n)) {
    echo "Fail 3\n";
    exit;
}

echo "Success\n";
