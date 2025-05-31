// Efeito de scroll no menu
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY >= 100) {
        nav.classList.add('nav-black');
    } else {
        nav.classList.remove('nav-black');
    }
});

// Atualiza a exibição do menu conforme status do usuário
function atualizarMenuUsuario(status) {
    const dropdown = document.querySelector('.dropdown');
    if (status === 'logado') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// Variável global para armazenar ação após alerta
let proximaAcao = null;

// Mostra alerta com bloqueio de fundo
function mostrarAlerta(mensagem, aoConfirmar = null) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
    document.getElementById("fundoBloqueador").style.display = "block";
    document.body.style.overflow = "hidden"; // desativa o scroll
    proximaAcao = aoConfirmar;
}

// Fecha o alerta e executa ação (se houver)
function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";
    document.getElementById("fundoBloqueador").style.display = "none";
    document.body.style.overflow = "auto"; // reativa o scroll
    if (typeof proximaAcao === "function") {
        proximaAcao();
        proximaAcao = null;
    }
}

// Verifica se a sessão do usuário ainda está ativa
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

// Executa a verificação inicial e define intervalo de verificação
verificarSessao();
setInterval(verificarSessao, 5000);

// Previne teclas fora o Enter durante alerta
document.addEventListener("keydown", function(e) {
    const alerta = document.getElementById("alertaPersonalizado");
    const aberto = alerta && alerta.style.display === "block";

    if (aberto && e.key !== "Enter") {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Carrega jogos dinamicamente nas seções
async function carregarJogos() {
    try {
        const response = await fetch('../php/listar_jogos.php');
        const jogos = await response.json();

        const lancamentosContainer = document.querySelectorAll('.row-posters')[0];
        const popularContainer = document.querySelectorAll('.row-posters')[1];
        const vendidosContainer = document.querySelectorAll('.row-posters')[2];
        const melhorAvaliadosContainer = document.querySelectorAll('.row-posters')[3];

        jogos.forEach(jogo => {
        const criarImagem = () => {
            const img = document.createElement('img');
            img.src = `../imagens_jogos/${jogo.imagem}`;
            img.alt = "Imagem do jogo";
            img.classList.add('row-poster');
            img.addEventListener('click', () => {
                window.location.href = `pagina_jogo.html?id=${jogo.id}`;
            });
            return img;
        };

        lancamentosContainer.appendChild(criarImagem());
        popularContainer.appendChild(criarImagem());
        vendidosContainer.appendChild(criarImagem());

        if (parseFloat(jogo.avaliacao) >= 8.0) {
            melhorAvaliadosContainer.appendChild(criarImagem());
        }
    });


    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
    }
}


// Chamar quando a página carregar
carregarJogos();
