function mostrarAlerta(mensagem) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
}

function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";
}

function verificarSessao() {
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'expirado') {
                mostrarAlerta('Tempo de sessão expirado! Faça login novamente.');
                window.location.href = '../html/login.html';
            } else if (data.status === 'logado') {
                console.log('Usuário logado:', data.user_id);
            } else if (data.status === 'nao_logado') {
                mostrarAlerta('Você precisa estar logado para acessar esta página.');
                window.location.href = '../html/bem_vindo.html';
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
