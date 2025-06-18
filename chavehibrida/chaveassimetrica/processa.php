<?php
if (!isset($_POST['mensagem'])) {
    http_response_code(400);
    echo "Mensagem não fornecida.";
    exit;
}

$mensagemCriptografada = base64_decode($_POST['mensagem']);

// Caminho para a chave privada
$privateKeyPath = __DIR__ . '/keys/private.pem';

if (!file_exists($privateKeyPath)) {
    http_response_code(500);
    echo "Chave privada não encontrada.";
    exit;
}

$privateKeyContent = file_get_contents($privateKeyPath);
$privateKey = openssl_pkey_get_private($privateKeyContent);

if (!$privateKey) {
    http_response_code(500);
    echo "Erro ao carregar a chave privada.";
    exit;
}

$mensagemDescriptografada = '';
$sucesso = openssl_private_decrypt($mensagemCriptografada, $mensagemDescriptografada, $privateKey);

if ($sucesso) {
    echo $mensagemDescriptografada;
} else {
    echo "Erro ao descriptografar a mensagem.";
}
?>
