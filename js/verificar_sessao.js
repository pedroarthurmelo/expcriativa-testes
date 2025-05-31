// Conteúdo para ../js/verificar_sessao.js

/**
 * Verifica a sessão do usuário.
 * @param {boolean} isInitialCheck - True se for a primeira verificação ao carregar a página.
 */
function verificarSessao(isInitialCheck = false) {
    fetch('../php/verificar_sessao.php', { cache: 'no-store' }) // Evitar cache
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na rede ou erro no servidor: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'expirado' || data.status === 'nao_logado_redirect') {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else {
                    window.location.href = '../html/login.html?reason=fallback_redirect';
                }
            } else if (data.status === 'logado') {
                if (isInitialCheck) {
                    console.log('Sessão verificada e válida. Usuário:', data.user_id);
                    // Lógica adicional após login confirmado pode vir aqui (ex: carregar dados da página)
                }
            } else {
                console.warn('Status de sessão desconhecido:', data.status);
                if (isInitialCheck) {
                    window.location.href = '../html/login.html?reason=unknown_status';
                }
            }
        })
        .catch(error => {
            console.error('Erro crítico ao verificar a sessão:', error);
            if (isInitialCheck) {
                window.location.href = '../html/login.html?reason=session_check_failed';
            }
        });
}

// --- Execução do Script de Verificação de Sessão ---

// 1. VERIFICAÇÃO INICIAL:
verificarSessao(true);

// 2. VERIFICAÇÕES PERIÓDICAS:
// Intervalo de 5 minutos (300.000 ms). Ajuste conforme sua necessidade.
// Seu código original usava 5000ms (5 segundos), o que é bastante frequente.
const TEMPO_VERIFICACAO_PERIODICA = 1000;
setInterval(() => {
    verificarSessao(false);
}, TEMPO_VERIFICACAO_PERIODICA);

// As funções mostrarAlerta e fecharAlerta não são chamadas diretamente neste script
// para os casos de 'expirado' ou 'nao_logado_redirect', pois o alerta será na página de login.
// Se você precisar delas para outros fins neste arquivo, garanta que estejam definidas ou importadas.