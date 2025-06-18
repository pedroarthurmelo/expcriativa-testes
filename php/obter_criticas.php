<?php
include 'conexao.php'; //
header("Content-Type: application/json"); //

// Carregar chave privada do servidor
$privateKey = file_get_contents('private.pem');
if (!$privateKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao carregar a chave privada do servidor.']);
    exit;
}

$encryptedData = $_POST['encryptedData'] ?? '';
$encryptedKey = $_POST['encryptedKey'] ?? '';

if (empty($encryptedData) || empty($encryptedKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados de requisição incompletos.']);
    exit;
}

// 1. Descriptografar a chave AES (e IV) da requisição com a chave privada RSA do servidor
$decryptedRequestKeyJson = '';
if (!openssl_private_decrypt(base64_decode($encryptedKey), $decryptedRequestKeyJson, $privateKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'Falha na descriptografia da chave de sessão da requisição.']);
    exit;
}

$requestKeyData = json_decode($decryptedRequestKeyJson, true);
if (!$requestKeyData || !isset($requestKeyData['key']) || !isset($requestKeyData['iv'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato inválido da chave de sessão da requisição.']);
    exit;
}

$requestAesKey = hex2bin($requestKeyData['key']);
$requestIv = hex2bin($requestKeyData['iv']);

// 2. Descriptografar os dados da requisição (ID do jogo) com a chave AES e IV
$decodedEncryptedData = base64_decode($encryptedData);
$decryptedRequestDataJson = openssl_decrypt(
    $decodedEncryptedData,
    'aes-128-cbc',
    $requestAesKey,
    OPENSSL_RAW_DATA,
    $requestIv
);

if ($decryptedRequestDataJson === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Falha na descriptografia dos dados da requisição.']);
    exit;
}

$requestPayload = json_decode($decryptedRequestDataJson, true);
if (!$requestPayload || !isset($requestPayload['jogo'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato inválido do payload da requisição.']);
    exit;
}

$idJogo = intval($requestPayload['jogo']); //

if ($idJogo <= 0) { //
    // Se o ID do jogo for inválido, retorne um array vazio criptografado
    $responsePayload = json_encode([]); //
} else {
    $query = "SELECT u.username, c.texto
              FROM criticas c
              JOIN usuarios u ON u.id = c.id_usuario
              WHERE c.id_jogo = ?
              ORDER BY c.data_criacao DESC"; //

    $stmt = mysqli_prepare($con, $query); //
    mysqli_stmt_bind_param($stmt, "i", $idJogo); //
    mysqli_stmt_execute($stmt); //
    $result = $stmt->get_result(); //

    $comentarios = []; //
    while ($row = mysqli_fetch_assoc($result)) { //
        $comentarios[] = $row; //
    }
    mysqli_stmt_close($stmt); //
    $responsePayload = json_encode($comentarios); //
}


// 🔐 Criptografar a resposta (array de comentários ou vazio) com a mesma chave AES da requisição
$encryptedComments = openssl_encrypt(
    $responsePayload,
    'aes-128-cbc',
    $requestAesKey, // Usar a mesma chave AES da requisição do cliente
    OPENSSL_RAW_DATA,
    $requestIv      // Usar o mesmo IV da requisição do cliente
);

if ($encryptedComments === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao criptografar os dados de resposta.']);
    exit;
}

// Retornar apenas os dados criptografados. O cliente já tem a AES key e IV para descriptografar.
echo json_encode([
    'encryptedComments' => base64_encode($encryptedComments)
]);
?>