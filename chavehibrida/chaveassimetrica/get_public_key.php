<?php
header('Content-Type: text/plain');

$publicKeyPath = __DIR__ . '/keys/public.pem';

if (!file_exists($publicKeyPath)) {
    http_response_code(500);
    echo "Chave pública não encontrada.";
    exit;
}

echo file_get_contents($publicKeyPath);
