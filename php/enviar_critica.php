<?php
session_start(); //
header("Content-Type: application/json"); //
include 'conexao.php'; //

// Carregar chave privada do servidor
$privateKey = file_get_contents('private.pem');
if (!$privateKey) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Falha ao carregar a chave privada do servidor.']);
    exit;
}

$encryptedData = $_POST['encryptedData'] ?? '';
$encryptedKey = $_POST['encryptedKey'] ?? '';

if (empty($encryptedData) || empty($encryptedKey)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
    exit;
}

// 1. Descriptografar a chave AES (e IV) da requisição com a chave privada RSA do servidor
$decryptedRequestKeyJson = '';
if (!openssl_private_decrypt(base64_decode($encryptedKey), $decryptedRequestKeyJson, $privateKey)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Falha na descriptografia da chave de sessão da requisição.']);
    exit;
}

$requestKeyData = json_decode($decryptedRequestKeyJson, true);
if (!$requestKeyData || !isset($requestKeyData['key']) || !isset($requestKeyData['iv'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Formato inválido da chave de sessão da requisição.']);
    exit;
}

$requestAesKey = hex2bin($requestKeyData['key']);
$requestIv = hex2bin($requestKeyData['iv']);

// 2. Descriptografar os dados da requisição (crítica e jogo ID) com a chave AES e IV
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
    echo json_encode(['status' => 'error', 'message' => 'Falha na descriptografia dos dados da requisição.']);
    exit;
}

$requestPayload = json_decode($decryptedRequestDataJson, true);
if (!$requestPayload || !isset($requestPayload['critica']) || !isset($requestPayload['jogo'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Formato inválido do payload da requisição.']);
    exit;
}

$critica = $requestPayload['critica'];
$jogoID = intval($requestPayload['jogo']);
$userId = $_SESSION['user_id'] ?? null; // Get user ID from session

if (!$userId) { //
    // If not logged in, return an error (or redirect to login on frontend)
    $responsePayload = json_encode(['status' => 'erro', 'mensagem' => 'Usuário não autenticado']); //
} else {
    // Valida os dados recebidos
    if (empty($critica) || $jogoID <= 0) { //
        $responsePayload = json_encode(['status' => 'erro', 'mensagem' => 'Crítica vazia ou ID do jogo inválido']); //
    } else {
        // Prepara a query para inserir a crítica
        $query = "INSERT INTO criticas (id_usuario, id_jogo, texto) VALUES (?, ?, ?)"; //
        $stmt = mysqli_prepare($con, $query); //
        mysqli_stmt_bind_param($stmt, "iis", $userId, $jogoID, $critica); //

        if (mysqli_stmt_execute($stmt)) { //
            $responsePayload = json_encode(['status' => 'ok', 'mensagem' => 'Crítica enviada com sucesso!']); //
        } else {
            $responsePayload = json_encode(['status' => 'erro', 'mensagem' => 'Erro ao salvar crítica: ' . mysqli_error($con)]); //
        }
        mysqli_stmt_close($stmt); //
    }
}


// 🔐 Criptografar a resposta (status da operação) com a mesma chave AES da requisição
$encryptedResponse = openssl_encrypt(
    $responsePayload,
    'aes-128-cbc',
    $requestAesKey, // Usar a mesma chave AES da requisição do cliente
    OPENSSL_RAW_DATA,
    $requestIv      // Usar o mesmo IV da requisição do cliente
);

if ($encryptedResponse === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Falha ao criptografar a resposta.']);
    exit;
}

// Retornar apenas a resposta criptografada. O cliente já tem a AES key e IV para descriptografar.
echo json_encode([
    'encryptedResponse' => base64_encode($encryptedResponse)
]);
mysqli_close($con); //
?>