<?php
session_start();
header("Content-Type: application/json");
include 'conexao.php';

// Verifica se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Usuário não logado']);
    exit;
}

$userId = $_SESSION['user_id'];
$dados = json_decode(file_get_contents("php://input"), true);

// Valida os dados recebidos
$texto = trim($dados['critica'] ?? '');
$idJogo = intval($dados['jogo'] ?? 0);

if (empty($texto) || $idJogo <= 0) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Crítica vazia ou ID do jogo inválido']);
    exit;
}

// Prepara a query para inserir a crítica
$query = "INSERT INTO criticas (id_usuario, id_jogo, texto) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "iis", $userId, $idJogo, $texto);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao salvar crítica']);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>
