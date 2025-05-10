function login() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let hashedPassword = CryptoJS.SHA256(senha).toString(); // Gera hash antes do envio

    let formData = new FormData();
    formData.append("email", email);
    formData.append("senha", hashedPassword);

    fetch("../php/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.status === "success") {
            // Login comum
            window.location.href = "dashboard.html";
        } else if (data.status === "activate_2fa") {
            // Redireciona para ativar o 2FA
            window.location.href = "../html/ativar_2fa.html";
        } else if (data.status === "2fa_required") {
            // Redireciona para verificar o código do 2FA
            window.location.href = "../html/verificar_2fa.html";
        } else if (data.status === "not_verified") {
            alert("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro no login. Tente novamente.");
    });
}
