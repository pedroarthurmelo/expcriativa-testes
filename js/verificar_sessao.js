function verificarSessao() {
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'nao_logado') {
                alert('Você precisa estar logado para acessar esta página.');
                window.location.href = '../html/bem_vindo.html';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
}

verificarSessao();
