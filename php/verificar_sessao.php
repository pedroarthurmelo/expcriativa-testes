<?php
// verificar_sessao.php
session_start();
header("Content-Type: application/json");

// Verifica se o usuário está logado
if (isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'logado', 'user_id' => $_SESSION['user_id']]);
} else {
    echo json_encode(['status' => 'nao_logado']);
}
?>
