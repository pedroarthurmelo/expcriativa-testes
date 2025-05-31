async function carregarJogos() {
    const select = document.getElementById('jogoSelect');
    try {
        const response = await fetch('../php/listar_jogos.php');
        const jogos = await response.json();

        select.innerHTML = '<option value="">Selecione um jogo</option>';
        jogos.forEach(jogo => {
            const option = document.createElement('option');
            option.value = jogo.id;
            option.textContent = jogo.nome;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar jogos:', err);
    }
}

async function deletarJogo() {
    const jogoId = document.getElementById('jogoSelect').value;
    if (!jogoId) {
        alert('Selecione um jogo.');
        return;
    }

    const confirmacao = confirm("Tem certeza que deseja deletar este jogo?");
    if (!confirmacao) return;

    try {
        const response = await fetch('../php/deletar_jogo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: jogoId })
        });

        const resultado = await response.json();
        const msgDiv = document.getElementById("mensagem");

        if (resultado.sucesso) {
            msgDiv.textContent = "Jogo deletado com sucesso!";
            carregarJogos(); // Atualiza a lista
        } else {
            msgDiv.textContent = "Erro ao deletar jogo.";
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
    }
}

// Carrega jogos ao abrir a página
carregarJogos();
