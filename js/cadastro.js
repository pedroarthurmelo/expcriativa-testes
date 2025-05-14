function mostrarAlerta(mensagem) {
    document.getElementById("mensagemAlerta").textContent = mensagem;
    document.getElementById("alertaPersonalizado").style.display = "block";
}

function fecharAlerta() {
    document.getElementById("alertaPersonalizado").style.display = "none";
}


function cadastrar() {
    let usuario = document.getElementById("username").value;
    let nome_completo = document.getElementById("nome_completo").value;
    let email = document.getElementById("email").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let senha = document.getElementById("senha").value;
    let confirmarSenha = document.getElementById("confirmarSenha").value;

    // Biblioteca do CRYPTOJS
    let hashSenha = CryptoJS.SHA256(senha).toString();
    let hashConfirmarSenha = CryptoJS.SHA256(confirmarSenha).toString();

    // EXPRESSÕES REGULARES
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    let regexTelefone = /^\(\d{2}\)\s?(9\s?\d{4}|\d{4})-\d{4}$/;
    let regexSenha = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!.])[0-9a-zA-Z$*&@#!.]{8,}$/;

    if (usuario == ""){
        mostrarAlerta("Usuário não pode estar vazio!");
        return;
    }

    if (nome_completo == ""){
        mostrarAlerta("Nome Completo não pode estar vazio!");
        return;
    }

    // Validando email
    if (!regexEmail.test(email)) {
        mostrarAlerta("Email precisa ser válido (EX: teste@dominio.com)");
        return;
    }

    // Validando CPF
    if (!regexCPF.test(cpf)) {
        mostrarAlerta("CPF apenas nesse formato -> xxx.xxx.xxx-xx");
        return;
    }

    // Validando telefone
    if (!regexTelefone.test(telefone)) {
        mostrarAlerta("Telefone apenas nesses formatos -> (xx) 9xxxx-xxxx, (xx) 9 xxxx-xxxx, (xx) xxxx-xxxx");
        return;
    }

    // Validando senha
    if (!regexSenha.test(senha)) {
        mostrarAlerta("A senha precisa ter no mínimo 8 caracteres, entre eles, 1 número, 1 letra maiúscula e 1 símbolo.");
        return;
    }

    // Verificando se as senhas são iguais
    if (hashSenha !== hashConfirmarSenha) {
        mostrarAlerta("As senhas não são iguais.");
        return;
    }

    // ENVIAR PARA O PHP VIA POST
    var form = document.getElementById('formulario');
    var dados = new FormData(form);

    dados.set("senha", hashSenha);
    dados.set("confirmarSenha", hashConfirmarSenha);

    fetch("../php/envio_email.php", {
        method: "POST",
        body: dados
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarAlerta("E-mail de verificação enviado! Verifique sua caixa de entrada.");
            setTimeout(() => {
                window.location.href = "../html/login.html";
            }, 5000); // espera 2s antes de redirecionar
        } else {
            mostrarAlerta("Erro ao enviar e-mail: " + data.message);
        }
    })
    .catch(error => {
        mostrarAlerta("Erro na requisição: " + error);
    });
}
