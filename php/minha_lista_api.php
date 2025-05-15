<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'msg' => 'Usuário não logado']);
    exit;
}

$id_usuario = $_SESSION['usuario_id'];

include 'conexao.php'; // sua conexão

$stmt = $mysqli->prepare("SELECT jogo, data_adicionado FROM minha_lista WHERE id_usuario = ? ORDER BY data_adicionado DESC");
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$jogos = [];
while ($row = $result->fetch_assoc()) {
    $jogos[] = $row;
}

$stmt->close();
$mysqli->close();

echo json_encode(['success' => true, 'lista' => $jogos]);
