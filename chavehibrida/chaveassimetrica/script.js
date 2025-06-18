document.addEventListener('DOMContentLoaded', () => {
  let encryptor;

  // Buscar a chave pública no servidor
  fetch('get_public_key.php')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar a chave pública');
      return response.text();
    })
    .then(publicKey => {
      encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
    })
    .catch(err => {
      alert('Erro ao carregar a chave pública: ' + err.message);
    });

  document.getElementById('msgForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (!encryptor) {
      alert('Chave pública ainda não carregada.');
      return;
    }

    const mensagem = document.getElementById('mensagem').value;
    const encrypted = encryptor.encrypt(mensagem);

    if (!encrypted) {
      alert('Erro ao criptografar a mensagem.');
      return;
    }

    const formData = new FormData();
    formData.append('mensagem', encrypted);

    fetch('processa.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      alert("Mensagem decriptografada no servidor: " + data);
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao enviar a mensagem.');
    });
  });
});
