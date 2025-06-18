<?php
header('Content-Type: text/plain');

// Carregar a chave privada RSA
$privateKeyPath = 'private.key'; // Caminho para sua chave privada
$rsaPrivateKey = file_get_contents($privateKeyPath);

if (!$rsaPrivateKey) {
    die("Erro: Chave privada RSA não encontrada ou não pôde ser lida.");
}

// Obter os dados JSON do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$encryptedMessageBase64 = $data['encryptedMessage'] ?? null;
$encryptedAesKeyRsaBase64 = $data['encryptedAesKey'] ?? null;
$aesIvHex = $data['aesIv'] ?? null;

if (!$encryptedMessageBase64 || !$encryptedAesKeyRsaBase64 || !$aesIvHex) {
    die("Erro: Dados criptografados incompletos recebidos.");
}

// 1. Descriptografar a chave AES com a chave privada RSA
$decryptedAesKey = '';
$encryptedAesKeyRsa = base64_decode($encryptedAesKeyRsaBase64); // Decodificar de Base64 para binário

if (!openssl_private_decrypt($encryptedAesKeyRsa, $decryptedAesKey, $rsaPrivateKey, OPENSSL_PKCS1_PADDING)) {
    die("Erro ao descriptografar a chave AES com RSA: " . openssl_error_string());
}

// A chave AES descriptografada estará em Base64, como gerada pelo JS
// A chave simétrica (AES) está agora em $decryptedAesKey (string Base64)

// 2. Descriptografar a mensagem principal com a chave AES descriptografada e o IV
$encryptedMessage = base64_decode($encryptedMessageBase64); // Decodificar de Base64 para binário
$aesIvBinary = hex2bin($aesIvHex); // Converter IV de Hex para binário

// Use openssl_decrypt para AES
// Importante: A chave AES precisa ser convertida de Base64 para binário para openssl_decrypt
$decryptedAesKeyBinary = base64_decode($decryptedAesKey);


$decryptedMessage = openssl_decrypt(
    $encryptedMessage,
    'aes-256-cbc', // Algoritmo AES-256-CBC
    $decryptedAesKeyBinary,
    OPENSSL_RAW_DATA, // Retornar dados brutos
    $aesIvBinary
);

if ($decryptedMessage === false) {
    echo "Erro ao descriptografar a mensagem com AES.";
    // Para depuração: echo openssl_error_string();
} else {
    echo "Mensagem Descriptografada: " . $decryptedMessage;
}
?>