function verificarSessao() {
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'nao_logado') {
                alert('Você precisa estar logado para acessar esta página.');
                window.location.href = '../html/bem_vindo.html';
            } else if (data.status === 'expirado') {
                alert('Tempo de sessão expirado! Faça login novamente.');
                window.location.href = '../html/bem_vindo.html';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
}

// Verifica a sessão a cada 5 segundos
setInterval(verificarSessao, 5000);

// E também verifica imediatamente ao carregar
verificarSessao();
