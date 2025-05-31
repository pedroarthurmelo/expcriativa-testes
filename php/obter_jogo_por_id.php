<?php
// Conecte ao banco
include("conexao.php"); // supondo que você já tenha isso feito

header("Content-Type: application/json");

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $sql = "SELECT * FROM jogos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $resultado = $stmt->get_result();
        if ($resultado->num_rows > 0) {
            $jogo = $resultado->fetch_assoc();
            echo json_encode($jogo);
        } else {
            http_response_code(404);
            echo json_encode(["erro" => "Jogo não encontrado."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro na execução da consulta."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["erro" => "ID do jogo não fornecido."]);
}
?>
