// Scroll efeito no menu (mantido aqui)
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY >= 100) {
        nav.classList.add('nav-black');
    } else {
        nav.classList.remove('nav-black');
    }
});

function atualizarMenuUsuario(status) {
    const dropdown = document.querySelector('.dropdown');
    if (status === 'logado') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// Variável global para armazenar ação pós-alerta
let acaoAposFechar = null;

function mostrarAlerta(mensagem, aoConfirmar = null) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
    acaoAposFechar = aoConfirmar;
}

function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";
    
    if (acaoAposFechar && typeof acaoAposFechar === 'function') {
        acaoAposFechar();
        acaoAposFechar = null; // Limpa a referência
    }
}

function verificarSessao() {
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'expirado') {
                mostrarAlerta('Tempo de sessão expirado! Faça login novamente.', () => {
                    window.location.href = '../html/login.html';
                });
            } else {
                atualizarMenuUsuario(data.status);
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
}

// Executa a verificação inicial
verificarSessao();

// Verifica a cada 5 segundos
setInterval(verificarSessao, 5000);
