document.getElementById("formJogo").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch("../php/adicionar_jogo.php", {
      method: "POST",
      body: formData,
    });

    const resultado = await response.json();
    document.getElementById("mensagem").textContent = resultado.mensagem;

    if (resultado.sucesso) {
      this.reset();
    }
  } catch (error) {
    document.getElementById("mensagem").textContent = "Erro na requisição.";
    console.error(error);
  }
});
