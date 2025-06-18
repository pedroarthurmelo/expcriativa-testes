<?php
// Recupera os dados do POST
$mensagemCriptografada = $_POST['mensagem'] ?? '';
$ivHex = $_POST['iv'] ?? '';
$chaveHex = $_POST['chave'] ?? '';

// Converter de HEX para binário
$iv = hex2bin($ivHex);
$chave = hex2bin($chaveHex);

// Decodificar a mensagem base64
$mensagemCifrada = base64_decode($mensagemCriptografada);

// Descriptografar com AES-128-CBC
$mensagemDescriptografada = openssl_decrypt(
  $mensagemCifrada,
  'aes-128-cbc',
  $chave,
  OPENSSL_RAW_DATA,
  $iv
);

echo "Mensagem descriptografada: " . htmlspecialchars($mensagemDescriptografada);
