<?php
session_start();
header("Content-Type: application/json");

$tempoMaximo = 5; // 20 segundos

if (isset($_SESSION['user_id'])) {
    if (isset($_SESSION['ultimo_acesso'])) {
        $tempoInativo = time() - $_SESSION['ultimo_acesso'];
        if ($tempoInativo > $tempoMaximo) {
            session_unset();
            session_destroy();
            echo json_encode(['status' => 'expirado']);
            exit();
        }
    }

    // Atualiza o tempo do último acesso
    $_SESSION['ultimo_acesso'] = time();

    echo json_encode(['status' => 'logado', 'user_id' => $_SESSION['user_id']]);
} else {
    echo json_encode(['status' => 'nao_logado']);
}
?>
