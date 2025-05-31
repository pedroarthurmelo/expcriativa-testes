<?php
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    echo json_encode(["erro" => "ID do jogo não fornecido."]);
    exit;
}

$id = intval($_GET['id']);

require_once 'conexao.php'; // Caminho correto para a conexão com .env

// Prepara e executa a query
$stmt = $con->prepare("SELECT * FROM jogos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$jogo = $result->fetch_assoc();

if ($jogo) {
    echo json_encode($jogo);
} else {
    echo json_encode(["erro" => "Jogo não encontrado."]);
}

$stmt->close();
$con->close();
