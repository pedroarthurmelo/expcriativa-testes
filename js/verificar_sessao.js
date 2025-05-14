function verificarSessao() {
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'expirado') {
                alert('Tempo de sessão expirado! Faça login novamente.');
                window.location.href = '../html/login.html';
            } else if (data.status === 'logado') {
                // Usuário logado, tudo certo — sessão atualizada automaticamente
                console.log('Usuário logado:', data.user_id);
            } else {
                // Usuário não logado — mas pode navegar livremente
                console.log('Usuário navegando como visitante.');
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
}

// Verifica a sessão a cada 5 segundos
setInterval(verificarSessao, 5000);

// Verifica imediatamente ao carregar
verificarSessao();
