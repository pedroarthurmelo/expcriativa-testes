<?php
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    echo json_encode(["erro" => "ID do jogo não fornecido."]);
    exit;
}

$id = intval($_GET['id']);

require_once 'conexao.php';

// Buscar dados do jogo
$stmt = $con->prepare("SELECT * FROM jogos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$jogo = $result->fetch_assoc();
$stmt->close();

if (!$jogo) {
    echo json_encode(["erro" => "Jogo não encontrado."]);
    exit;
}

// Buscar requisitos do sistema
$stmtReq = $con->prepare("SELECT * FROM requisitos_sistema WHERE id_jogo = ?");
$stmtReq->bind_param("i", $id);
$stmtReq->execute();
$resultReq = $stmtReq->get_result();

$requisitos_minimos = "";
$requisitos_recomendados = "";

while ($req = $resultReq->fetch_assoc()) {
    $texto = 
        "SO: {$req['so']}\n" .
        "Processador: {$req['processador']}\n" .
        "Memória: {$req['memoria']}\n" .
        "Placa de Vídeo: {$req['placa_video']}\n" .
        "Armazenamento: {$req['armazenamento']}";

    if ($req['tipo'] === 'minimos') {
        $requisitos_minimos = $texto;
    } elseif ($req['tipo'] === 'recomendados') {
        $requisitos_recomendados = $texto;
    }
}
$stmtReq->close();

// Adiciona os requisitos ao array do jogo
$jogo['requisitos_minimos'] = $requisitos_minimos;
$jogo['requisitos_recomendados'] = $requisitos_recomendados;

echo json_encode($jogo);
$con->close();
?>
