<?php
include 'conexao.php';

$idJogo = intval($_GET['jogo'] ?? 0);

if ($idJogo <= 0) {
    echo json_encode([]);
    exit;
}

$query = "SELECT u.username, c.texto 
          FROM criticas c
          JOIN usuarios u ON u.id = c.id_usuario
          WHERE c.id_jogo = ?
          ORDER BY c.data_criacao DESC";

$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "i", $idJogo);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$comentarios = [];
while ($row = mysqli_fetch_assoc($result)) {
    $comentarios[] = $row;
}

header("Content-Type: application/json");
echo json_encode($comentarios);
?>
