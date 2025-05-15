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

function getEmailFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('email');
}

function validarCodigo() {
    const codigo = document.getElementById('codigo').value;
    const email = getEmailFromURL();

    if (!codigo) {
        mostrarAlerta("Por favor, preencha o código.");
        return;
    }

    let formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('email', email);

    fetch('../php/validar_codigo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            mostrarAlerta("Código verificado com sucesso!", () => {
                window.location.href = `../html/nova_senha.html?email=${encodeURIComponent(email)}`;
            });
        } else {
            mostrarAlerta("Erro: " + data.message);
        }
    })
    .catch(err => {
        console.error("Erro:", err);
        mostrarAlerta("Erro na solicitação. Tente novamente.");
    });
}
