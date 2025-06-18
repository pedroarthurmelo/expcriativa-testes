<?php

$dadosCriptografados = $_POST["dados"];

// Mesma chave e IV usados no JS
$chave = '12345678ABCD1234';           // 16 bytes
$iv = '4321432143214321';              // 16 bytes

// Converte de Base64 para binário
$dadosBinarios = base64_decode($dadosCriptografados);

// Descriptografa
$dadosDescriptografados = openssl_decrypt(
    $dadosBinarios,
    'AES-128-CBC',
    $chave,
    OPENSSL_RAW_DATA,
    $iv
);

// Transforma JSON em array
$dados = json_decode($dadosDescriptografados, true);

// Retorna resposta
echo json_encode([
    "status" => "ok",
    "email" => $dados["email"] ?? "inválido",
    "senha" => $dados["senha"] ?? "inválido"
]);

?>
