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

function login() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (!email || !senha) {
        mostrarAlerta("Por favor, preencha todos os campos.");
        return;
    }

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
                window.location.href = "dashboard.html";
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
