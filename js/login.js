let proximaAcao = null; // Variável global temporária

function mostrarAlerta(mensagem, aoConfirmar = null) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
    document.getElementById("fundoBloqueador").style.display = "block";
    document.body.style.overflow = "hidden"; // desativa o scroll
    proximaAcao = aoConfirmar;
}

function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";
    document.getElementById("fundoBloqueador").style.display = "none";
    document.body.style.overflow = "auto"; // reativa o scroll
    if (typeof proximaAcao === "function") {
        proximaAcao();
        proximaAcao = null;
    }
}

function login() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (!email || !senha) {
        mostrarAlerta("Por favor, preencha todos os campos.");
        return;
    }

    // Certifique-se que a biblioteca CryptoJS.SHA256 está carregada na sua página login.html
    // Ex: <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    let hashedPassword = CryptoJS.SHA256(senha).toString();

    let formData = new FormData();
    formData.append("email", email);
    formData.append("senha", hashedPassword);

    fetch("../php/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarAlerta(data.message, () => {
                window.location.href = "dashboard.html"; // Ajuste o caminho se necessário
            });
        } else if (data.status === "activate_2fa") {
            mostrarAlerta(data.message, () => {
                window.location.href = "../html/ativar_2fa.html";
            });
        } else if (data.status === "2fa_required") {
            mostrarAlerta(data.message, () => {
                window.location.href = "../html/verificar_2fa.html";
            });
        } else if (data.status === "not_verified") {
            mostrarAlerta("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.");
        } else {
            mostrarAlerta(data.message || "Erro no login. Tente novamente.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        mostrarAlerta("Erro no login. Tente novamente.");
    });
}

// Listener para o pressionamento de teclas quando o alerta estiver aberto
document.addEventListener("keydown", function(e) {
    const alerta = document.getElementById("alertaPersonalizado");
    const aberto = alerta && alerta.style.display === "block";

    if (aberto) {
        // Permite que a tecla Enter funcione para o botão de fechar (se ele estiver focado)
        // e previne outras teclas de interagirem com o fundo.
        if (e.key !== "Enter") {
            e.preventDefault();
            e.stopPropagation();
        }
        // Se você tiver um botão "OK" ou "Fechar" no alerta que chama fecharAlerta()
        // e ele estiver focado, Enter o ativará.
    }
}, true);


// Script para verificar motivo de redirecionamento na URL ao carregar a página de login
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    let alertMessage = null;

    if (reason === 'session_expired') {
        alertMessage = 'Tempo de sessão expirado! Faça login novamente.';
    } else if (reason === 'not_logged_in') {
        alertMessage = 'Você precisa fazer login primeiro para acessar esta página.';
    } else if (reason === 'session_check_failed') {
        alertMessage = 'Falha ao verificar sua sessão. Por favor, tente fazer login.';
    } else if (reason === 'fallback_redirect' || reason === 'unknown_status') {
        alertMessage = 'Ocorreu um redirecionamento inesperado. Por favor, faça login.';
    }
    // Adicione outros 'else if' para mais 'reasons' conforme necessário.

    if (alertMessage) {
        mostrarAlerta(alertMessage);
        // Opcional: Limpar o parâmetro da URL
        if (window.history.replaceState) {
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanURL }, '', cleanURL);
        }
    }
});