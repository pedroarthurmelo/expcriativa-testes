let acaoAposFechar = null; // Variável global temporária

function mostrarAlerta(mensagem, aoConfirmar = null) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
    acaoAposFechar = aoConfirmar;
}

function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";

    // Executa ação armazenada, se houver
    if (acaoAposFechar && typeof acaoAposFechar === "function") {
        acaoAposFechar();
        acaoAposFechar = null; // Limpa após executar
    }
}

window.onload = () => {
    fetch('../php/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'deslogado') {
                mostrarAlerta("Você foi deslogado com sucesso!", () => {
                    window.location.href = "../html/login.html";
                });
            } else {
                mostrarAlerta("Erro ao deslogar.");
            }
        })
        .catch(error => {
            console.error("Erro na requisição de logout:", error);
            mostrarAlerta("Erro de conexão.");
        });
};
