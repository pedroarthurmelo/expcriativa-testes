<?php
// Carregar chave privada
$privateKey = file_get_contents('private.pem');
if (!$privateKey) {
    die('Falha ao carregar a chave privada.');
}

// Receber dados
$encryptedMessage = $_POST['mensagem'] ?? '';
$encryptedKey = $_POST['chave'] ?? '';

if (empty($encryptedMessage) || empty($encryptedKey)) {
    die('Dados incompletos.');
}

// 🔓 Descriptografar chave AES + IV com RSA
openssl_private_decrypt(base64_decode($encryptedKey), $decryptedKeyJson, $privateKey);

$keyData = json_decode($decryptedKeyJson, true);
if (!$keyData) {
    die('Falha na descriptografia da chave.');
}

$aesKey = hex2bin($keyData['chave']);
$iv = hex2bin($keyData['iv']);

// 🔓 Descriptografar a mensagem com AES
$decodedMessage = base64_decode($encryptedMessage);
$decrypted = openssl_decrypt(
    $decodedMessage,
    'aes-128-cbc',
    $aesKey,
    OPENSSL_RAW_DATA,
    $iv
);

if ($decrypted === false) {
    die('Falha na descriptografia da mensagem.');
}

echo "Mensagem recebida: " . htmlspecialchars($decrypted);
?>
