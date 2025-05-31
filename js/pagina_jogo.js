document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const jogoID = params.get("id");

    if (!jogoID) {
        alert("Jogo não especificado.");
        return;
    }

    try {
        const response = await fetch(`../php/obter_jogo.php?id=${encodeURIComponent(jogoID)}`);

        if (!response.ok) {
            throw new Error("Erro na resposta da requisição.");
        }

        const jogo = await response.json();

        if (!jogo || jogo.erro) {
            document.getElementById("titulo-jogo").textContent = "Jogo não encontrado.";
            return;
        }

        // Preencher os campos com os dados
        document.getElementById("titulo-jogo").textContent = jogo.nome || "Sem título";
        document.getElementById("imagem-jogo").src = `../imagens_jogos/${jogo.imagem || 'default.jpg'}`;
        document.getElementById("sinopse-jogo").textContent = jogo.sinopse || "Sem sinopse disponível.";
        document.getElementById("criadora-jogo").textContent = jogo.criadora || "Desconhecida";
        document.getElementById("generos-jogo").textContent = jogo.generos || "N/A";
        document.getElementById("plataformas-jogo").textContent = jogo.plataformas || "N/A";
        document.getElementById("avaliacao-jogo").textContent = `⭐ (${jogo.avaliacao || 0}/10)`;
        document.getElementById("lancamento-jogo").textContent = jogo.data_lancamento || "Data desconhecida";

        document.getElementById("requisitos-minimos").innerHTML = 
            (jogo.requisitos_minimos || "Não informado.").replace(/\n/g, "<br>");
        document.getElementById("requisitos-recomendados").innerHTML = 
            (jogo.requisitos_recomendados || "Não informado.").replace(/\n/g, "<br>");

        // TODO: Adicionar carregamento de críticas via AJAX/PHP aqui
    } catch (err) {
        console.error("Erro ao buscar dados do jogo:", err);
        document.getElementById("titulo-jogo").textContent = "Erro ao carregar o jogo.";
    }
});
