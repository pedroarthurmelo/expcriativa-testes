<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["sucesso" => false, "mensagem" => "Acesso negado. Faça login."]);
    exit;
}

require_once 'conexao.php';

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

$imagem_nome = null;

if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $arquivo_tmp = $_FILES['imagem']['tmp_name'];
    $nome_arquivo = basename($_FILES['imagem']['name']);
    $extensao = strtolower(pathinfo($nome_arquivo, PATHINFO_EXTENSION));
    
    // Agora aceita também .webp
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($extensao, $extensoes_permitidas)) {
        echo json_encode(["sucesso" => false, "mensagem" => "Tipo de arquivo não permitido."]);
        exit;
    }

    $pasta = '../imagens_jogos/'; // Certifique-se que esta pasta existe

    $novo_nome = uniqid('img_') . '.' . $extensao;
    $destino = $pasta . $novo_nome;

    if (!move_uploaded_file($arquivo_tmp, $destino)) {
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar a imagem."]);
        exit;
    }

    $imagem_nome = $novo_nome;
}


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
    echo json_encode(["sucesso" => true, "mensagem" => "Jogo adicionado com sucesso!"]);
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao adicionar jogo: " . $stmt->error]);
}

$stmt->close();
$con->close();
