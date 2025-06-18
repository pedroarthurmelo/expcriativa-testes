<?php

// header('Content-Type: text/plain'); // Definir o cabeçalho para texto simples

// Carregar a chave privada
$privateKey = file_get_contents('private.key');

if (!$privateKey) {
    die("Erro: Chave privada não encontrada ou não pôde ser lida.");
}

// Obter a mensagem criptografada do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$encryptedMessageBase64 = $data['encryptedMessage'] ?? null;

if (!$encryptedMessageBase64) {
    die("Erro: Mensagem criptografada não recebida.");
}

// A mensagem criptografada do JSEncrypt já vem em Base64.
// Decodificar de Base64 para binário antes de descriptografar.
$encryptedMessage = base64_decode($encryptedMessageBase64);

$decryptedText = '';

// Descriptografar a mensagem usando a chave privada
// OPENSSL_PKCS1_PADDING é o padrão para JSEncrypt para RSA
if (openssl_private_decrypt($encryptedMessage, $decryptedText, $privateKey, OPENSSL_PKCS1_PADDING)) {
    echo "Mensagem Descriptografada: " . $decryptedText;
} else {
    echo "Erro ao descriptografar a mensagem. Detalhes do erro: " . openssl_error_string();
}

?>