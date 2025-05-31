function getJogoID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

document.querySelector('.botao-critica').addEventListener('click', () => {
    const critica = document.getElementById('criticaInput').value.trim();
    const jogo = getJogoID();

    if (!critica) {
        alert("Digite sua crítica antes de enviar.");
        return;
    }

    if (!jogo) {
        alert("ID do jogo não encontrado na URL.");
        return;
    }

    fetch('../php/enviar_critica.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ critica, jogo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            document.getElementById('criticaInput').value = '';
            carregarComentarios(); // Atualiza lista de críticas
        } else {
            alert(data.mensagem);
        }
    });
});

function carregarComentarios() {
    const jogo = getJogoID();

    if (!jogo) return;

    fetch(`../php/obter_criticas.php?jogo=${encodeURIComponent(jogo)}`)
    .then(response => response.json())
    .then(data => {
        const comentariosDiv = document.getElementById('comentarios');
        comentariosDiv.innerHTML = '';
        if (data.length === 0) {
            comentariosDiv.innerHTML = '<p>Nenhuma crítica encontrada.</p>';
            return;
        }
        data.forEach(c => {
            comentariosDiv.innerHTML += `
                <h3>${c.username}:</h3>
                <p>${c.texto}</p><br>
            `;
        });
    });
}

document.addEventListener('DOMContentLoaded', carregarComentarios);
