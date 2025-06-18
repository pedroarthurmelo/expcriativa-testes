<?php
//arquivo que serve a chave publica para o javascript

$publicKeyPath = 'public.key';

if (file_exists($publicKeyPath)) {
    echo file_get_contents($publicKeyPath);
} else {
    http_response_code(404);
    echo "Chave pública não encontrada.";
}
?>