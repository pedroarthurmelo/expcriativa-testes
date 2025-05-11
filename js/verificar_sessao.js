export async function verificarSessaoOuRedirecionar() {
    try {
        const response = await fetch("../php/verificar_sessao.php", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!data.logado) {
            window.location.href = "../html/login.html";
        }
    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        window.location.href = "../html/login.html"; // segurança extra
    }
}
