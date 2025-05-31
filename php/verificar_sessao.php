<?php
session_start();
header("Content-Type: application/json");

// Tempo de sessão em segundos (ex: 20 minutos = 1200, 1 hora = 3600)
// O seu valor original é 12000000, o que é muito longo (aprox. 138 dias).
// Ajuste conforme necessário. Vou manter seu valor original por enquanto.
$tempoMaximo = 1000000000;

if (isset($_SESSION['user_id'])) {
    if (!isset($_SESSION['momento_login'])) {
        // Se momento_login não existe, mas user_id sim (caso raro, mas defensivo)
        $_SESSION['momento_login'] = time();
    }

    $tempoPassado = time() - $_SESSION['momento_login'];

    if ($tempoPassado > $tempoMaximo) {
        session_unset(); // Remove todas as variáveis de sessão
        session_destroy(); // Destrói a sessão
        echo json_encode([
            'status' => 'expirado',
            'redirect_url' => '../html/login.html?reason=session_expired'
        ]);
        exit();
    }

    // Sessão ativa e válida
    echo json_encode(['status' => 'logado', 'user_id' => $_SESSION['user_id']]);
    exit();

} else {
    // Usuário não está logado
    echo json_encode([
        'status' => 'nao_logado_redirect', // Status para indicar que precisa de login
        'redirect_url' => '../html/login.html?reason=not_logged_in'
    ]);
    exit();
}
?>