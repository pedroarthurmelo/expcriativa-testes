<?php
require_once 'conexao.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID não fornecido']);
    exit;
}

$id = intval($data['id']);

$sql = "DELETE FROM jogos WHERE id = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao deletar']);
}

$stmt->close();
$con->close();
?>
