<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["sucesso" => false, "mensagem" => "Acesso negado. Faça login."]);
    exit;
}

require_once 'conexao.php';

// Dados do jogo
$nome = $_POST['nome'] ?? '';
$sinopse = $_POST['sinopse'] ?? '';
$criadora = $_POST['criadora'] ?? '';
$generos = $_POST['generos'] ?? '';
$plataformas = $_POST['plataformas'] ?? '';
$avaliacao = $_POST['avaliacao'] ?? null;
$data_lancamento = $_POST['data_lancamento'] ?? null;

if (empty(trim($nome)) || empty(trim($criadora))) {
    echo json_encode(["sucesso" => false, "mensagem" => "Preencha os campos obrigatórios."]);
    exit;
}

// Upload da imagem
$imagem_nome = null;
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $arquivo_tmp = $_FILES['imagem']['tmp_name'];
    $nome_arquivo = basename($_FILES['imagem']['name']);
    $extensao = strtolower(pathinfo($nome_arquivo, PATHINFO_EXTENSION));
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($extensao, $extensoes_permitidas)) {
        echo json_encode(["sucesso" => false, "mensagem" => "Tipo de arquivo não permitido."]);
        exit;
    }

    $pasta = '../imagens_jogos/';
    $novo_nome = uniqid('img_') . '.' . $extensao;
    $destino = $pasta . $novo_nome;

    if (!move_uploaded_file($arquivo_tmp, $destino)) {
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar a imagem."]);
        exit;
    }

    $imagem_nome = $novo_nome;
}

// Inserir jogo
$stmt = $con->prepare("INSERT INTO jogos (nome, sinopse, criadora, generos, plataformas, avaliacao, data_lancamento, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro na preparação da query: " . $con->error]);
    exit;
}

$avaliacao_float = is_numeric($avaliacao) ? (float)$avaliacao : null;
$data_lancamento_str = !empty($data_lancamento) ? $data_lancamento : null;

$stmt->bind_param(
    "sssssdss",
    $nome,
    $sinopse,
    $criadora,
    $generos,
    $plataformas,
    $avaliacao_float,
    $data_lancamento_str,
    $imagem_nome
);

if ($stmt->execute()) {
    $id_jogo = $con->insert_id;

    // Coleta de requisitos mínimos
    $min_so = $_POST['min_so'] ?? '';
    $min_processador = $_POST['min_processador'] ?? '';
    $min_memoria = $_POST['min_memoria'] ?? '';
    $min_placa_video = $_POST['min_placa_video'] ?? '';
    $min_armazenamento = $_POST['min_armazenamento'] ?? '';

    // Coleta de requisitos recomendados
    $rec_so = $_POST['rec_so'] ?? '';
    $rec_processador = $_POST['rec_processador'] ?? '';
    $rec_memoria = $_POST['rec_memoria'] ?? '';
    $rec_placa_video = $_POST['rec_placa_video'] ?? '';
    $rec_armazenamento = $_POST['rec_armazenamento'] ?? '';

    // Inserção dos requisitos
    $stmt_requisitos = $con->prepare("INSERT INTO requisitos_sistema (id_jogo, tipo, so, processador, memoria, placa_video, armazenamento) VALUES (?, ?, ?, ?, ?, ?, ?)");

    if ($stmt_requisitos) {
        // Inserir mínimos
        $tipo = 'minimos';
        $stmt_requisitos->bind_param("issssss", $id_jogo, $tipo, $min_so, $min_processador, $min_memoria, $min_placa_video, $min_armazenamento);
        $stmt_requisitos->execute();

        // Inserir recomendados
        $tipo = 'recomendados';
        $stmt_requisitos->bind_param("issssss", $id_jogo, $tipo, $rec_so, $rec_processador, $rec_memoria, $rec_placa_video, $rec_armazenamento);
        $stmt_requisitos->execute();

        $stmt_requisitos->close();
    }

    echo json_encode(["sucesso" => true, "mensagem" => "Jogo e requisitos adicionados com sucesso!"]);
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao adicionar jogo: " . $stmt->error]);
}

$stmt->close();
$con->close();
