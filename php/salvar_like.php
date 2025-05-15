<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'msg' => 'Usuário não logado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$jogo = $data['jogo'] ?? null;

if (!$jogo) {
    echo json_encode(['success' => false, 'msg' => 'Jogo não informado']);
    exit;
}

$id_usuario = $_SESSION['usuario_id'];

include 'conexao.php'; // inclua aqui a conexão

// Verifica se já existe o jogo na lista
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM minha_lista WHERE id_usuario = ? AND jogo = ?");
$stmt->bind_param('is', $id_usuario, $jogo);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode(['success' => true, 'msg' => 'Jogo já está na lista']);
    exit;
}

// Insere o jogo na lista
$stmt = $mysqli->prepare("INSERT INTO minha_lista (id_usuario, jogo) VALUES (?, ?)");
$stmt->bind_param('is', $id_usuario, $jogo);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'msg' => 'Erro ao salvar no banco']);
}

$stmt->close();
$mysqli->close();
?>
