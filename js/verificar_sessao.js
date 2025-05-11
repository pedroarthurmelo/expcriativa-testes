// verificar_sessao.js
function verificarSessao() {
    // Envia a requisição para o arquivo PHP
    fetch('../php/verificar_sessao.php')
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            if (data.status === 'nao_logado') {
                // Se não estiver logado, redireciona para o login
                window.location.href = '../html/login.html';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
}

// Chama a função para verificar a sessão
verificarSessao();
