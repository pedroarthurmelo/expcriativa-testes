document.getElementById("formJogo").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = this;
  const mensagemEl = document.getElementById("mensagem");
  const formData = new FormData(form);

  // Desativa o botão para evitar envios múltiplos
  const botao = form.querySelector("button[type='submit']");
  botao.disabled = true;
  mensagemEl.textContent = "Enviando...";

  try {
    const response = await fetch("../php/adicionar_jogo.php", {
      method: "POST",
      body: formData,
    });

    const resultado = await response.json();

    mensagemEl.textContent = resultado.mensagem;
    mensagemEl.style.color = resultado.sucesso ? "green" : "red";

    if (resultado.sucesso) {
      form.reset();
    }

  } catch (error) {
    mensagemEl.textContent = "Erro na requisição.";
    mensagemEl.style.color = "red";
    console.error(error);
  } finally {
    botao.disabled = false;
  }
});
