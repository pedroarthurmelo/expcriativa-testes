<?php
session_start();
require_once 'conexao.php'; // conexão com o banco

header('Content-Type: application/json');

$sql = "SELECT * FROM jogos ORDER BY data_lancamento DESC";
$result = $con->query($sql);

$dados = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Adiciona o caminho da imagem para ser usado no src da tag <img>
        $row['imagem'] = '../imagens_jogos/' . $row['imagem'];
        $dados[] = $row;
    }
}

echo json_encode($dados);
?>
