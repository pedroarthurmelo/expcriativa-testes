// Variável global para guardar a ação após o alerta
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
        acaoAposFechar = null; // Limpa após executar
    }
}

function enviarCodigo() {
    const email = document.getElementById('email').value;

    if (!email) {
        mostrarAlerta("Por favor, preencha o e-mail.");
        return;
    }

    let formData = new FormData();
    formData.append('email', email);

    fetch('../php/enviar_codigo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            mostrarAlerta("Código enviado com sucesso! Verifique seu e-mail.", () => {
                window.location.href = `../html/validar_codigo.html?email=${encodeURIComponent(email)}`;
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
