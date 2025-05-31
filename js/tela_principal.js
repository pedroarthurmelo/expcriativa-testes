// Efeito de scroll no menu
const nav = document.getElementById('nav');
if (nav) { // Adiciona verificação para evitar erro se 'nav' não existir
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 100) {
            nav.classList.add('nav-black');
        } else {
            nav.classList.remove('nav-black');
        }
    });
}

// Atualiza a exibição do menu conforme status do usuário
function atualizarMenuUsuario(statusLogin) {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        if (statusLogin === 'logado') {
            dropdown.style.display = 'block'; // Ou 'flex', 'grid', dependendo do seu CSS
        } else {
            dropdown.style.display = 'none';
        }
    }
}

// Variável global para armazenar ação após alerta
let proximaAcao = null;

// Mostra alerta com bloqueio de fundo
function mostrarAlerta(mensagem, aoConfirmar = null) {
    const mensagemAlertaEl = document.getElementById("mensagemAlerta");
    const alertaPersonalizadoEl = document.getElementById("alertaPersonalizado");
    const fundoBloqueadorEl = document.getElementById("fundoBloqueador");

    // Garante que os elementos do alerta existem na página atual (tela_principal.html)
    if (mensagemAlertaEl && alertaPersonalizadoEl && fundoBloqueadorEl) {
        mensagemAlertaEl.textContent = mensagem;
        alertaPersonalizadoEl.style.display = "block";
        fundoBloqueadorEl.style.display = "block";
        document.body.style.overflow = "hidden"; // desativa o scroll
        proximaAcao = aoConfirmar;
    } else {
        // Se a estrutura do alerta não estiver na tela_principal.html,
        // este console.warn ajudará a depurar.
        // Para a lógica de redirecionamento de sessão expirada, o alerta será na login.html.
        console.warn("Elementos do alerta personalizado não encontrados na página atual. Usando alert nativo se necessário.");
        // Se esta função for chamada por outros motivos que não o redirecionamento, o alert nativo é um fallback.
        if (mensagem) { // Apenas mostra alert se houver mensagem
            alert(mensagem);
             if (typeof aoConfirmar === "function") {
                aoConfirmar();
            }
        }
    }
}

// Fecha o alerta e executa ação (se houver)
function fecharAlerta() {
    const alertaPersonalizadoEl = document.getElementById("alertaPersonalizado");
    const fundoBloqueadorEl = document.getElementById("fundoBloqueador");

    if (alertaPersonalizadoEl && fundoBloqueadorEl) {
        alertaPersonalizadoEl.style.display = "none";
        fundoBloqueadorEl.style.display = "none";
        document.body.style.overflow = "auto"; // reativa o scroll
    }
    if (typeof proximaAcao === "function") {
        proximaAcao();
        proximaAcao = null;
    }
}

// Verifica se a sessão do usuário ainda está ativa
// Verifica se a sessão do usuário ainda está ativa
function verificarSessao(isInitialCheck = false) {
    fetch('../php/verificar_sessao.php', { cache: 'no-store' }) // Evitar cache
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na rede ou erro no servidor ao verificar sessão: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'expirado') {
                // Redireciona diretamente com motivo
                const redirectURL = data.redirect_url || '../html/login.html?reason=session_expired';
                window.location.href = redirectURL;
            } else if (data.status === 'logado') {
                atualizarMenuUsuario('logado');
                if (isInitialCheck) {
                    console.log('Usuário logado na tela principal. User ID:', data.user_id);
                }
            } else if (data.status === 'nao_logado_redirect' || data.status === 'nao_logado') {
                atualizarMenuUsuario('nao_logado');
                if (isInitialCheck) {
                    console.log('Visitante não logado na tela principal.');
                }
            } else {
                atualizarMenuUsuario('nao_logado');
                console.warn('Status de sessão inesperado:', data.status);
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
            atualizarMenuUsuario('nao_logado');
            if (isInitialCheck) {
                console.error('Falha crítica na verificação inicial da sessão na tela principal.');
            }
        });
}

// Verificação inicial e periódica
verificarSessao(true);
const INTERVALO_VERIFICACAO_SESSAO = 1000; // 10 segundos
setInterval(() => {
    verificarSessao(false);
}, INTERVALO_VERIFICACAO_SESSAO);



// Previne teclas fora o Enter durante alerta (se houver alerta nesta página)
document.addEventListener("keydown", function(e) {
    const alerta = document.getElementById("alertaPersonalizado");
    const aberto = alerta && window.getComputedStyle(alerta).display === "block";

    if (aberto && e.key !== "Enter") {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Carrega jogos dinamicamente nas seções
async function carregarJogos() {
    try {
        const response = await fetch('../php/listar_jogos.php');
        if (!response.ok) {
            throw new Error(`Erro HTTP ao buscar jogos! Status: ${response.status}`);
        }
        const jogos = await response.json();

        const containers = document.querySelectorAll('.row-posters');
        // Verifica se há containers suficientes. Ajuste o número se mudar a estrutura do HTML.
        // Se a tela principal puder ter um número variável de seções, esta verificação pode ser adaptada.
        if (containers.length === 0) {
            console.warn('Nenhum container ".row-posters" encontrado para carregar jogos.');
            return;
        }
        
        // Limpa todos os containers encontrados antes de adicionar novos jogos
        containers.forEach(container => container.innerHTML = '');

        // Exemplo de como distribuir jogos, pode precisar de lógica mais específica
        // para quais jogos vão em "Lançamentos", "Popular", etc.
        // Aqui, estou simplificando e adicionando a todos os containers encontrados.
        // Você precisará ajustar a lógica de distribuição se for mais complexa.

        const lancamentosContainer = document.getElementById('lancamentos'); // Específico para lançamentos
        const popularContainer = containers[1]; // Assumindo ordem
        const vendidosContainer = containers[2]; // Assumindo ordem
        const melhorAvaliadosContainer = containers[3]; // Assumindo ordem


        jogos.forEach((jogo, index) => {
            const criarImagem = () => {
                const img = document.createElement('img');
                img.src = `../imagens_jogos/${jogo.imagem}`; 
                img.alt = jogo.titulo || "Imagem do jogo";
                img.classList.add('row-poster');
                img.dataset.gameId = jogo.id;
                
                img.addEventListener('click', () => {
                    window.location.href = `pagina_jogo.html?id=${jogo.id}`;
                });
                return img;
            };

            // Distribuição dos jogos - Adapte conforme sua necessidade
            // Esta é uma forma simples de distribuir, talvez você queira
            // critérios específicos (data, popularidade, vendas, avaliação)
            // vindos do seu PHP para cada seção.
            if(lancamentosContainer) lancamentosContainer.appendChild(criarImagem());
            
            // Para os outros, você pode querer clonar ou criar novas imagens
            // se o mesmo jogo puder aparecer em múltiplas seções.
            if(popularContainer && index < 10) popularContainer.appendChild(criarImagem()); // Ex: 10 primeiros populares
            if(vendidosContainer && index < 10) vendidosContainer.appendChild(criarImagem()); // Ex: 10 primeiros vendidos
            
            if (melhorAvaliadosContainer && parseFloat(jogo.avaliacao) >= 8.0) {
                melhorAvaliadosContainer.appendChild(criarImagem());
            }
        });

    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
    }
}

// Chama a função para carregar os jogos.
carregarJogos();
