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

function getEmailFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('email');
}

function atualizarSenha() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const email = getEmailFromURL();

    const regexSenha = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!.])[0-9a-zA-Z$*&@#!.]{8,}$/;

    if (!regexSenha.test(senha)) {
        mostrarAlerta("A senha precisa ter no mínimo 8 caracteres, incluindo 1 número, 1 letra maiúscula e 1 símbolo.");
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarAlerta("As senhas não coincidem.");
        return;
    }

    const hashSenha = CryptoJS.SHA256(senha).toString();

    let formData = new FormData();
    formData.append('email', email);
    formData.append('novaSenha', hashSenha);

    fetch('../php/atualizar_senha.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            mostrarAlerta("Senha atualizada com sucesso!", () => {
                window.location.href = '../html/login.html';
            });
        } else {
            mostrarAlerta("Erro: " + data.message);
        }
    })
    .catch(err => {
        console.error("Erro:", err);
        mostrarAlerta("Erro ao atualizar a senha.");
    });
}
