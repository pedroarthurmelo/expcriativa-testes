document.addEventListener('DOMContentLoaded', () => {
  let encryptor;

  // Buscar chave pública no servidor
  fetch('get_public_key.php')
    .then(response => response.text())
    .then(publicKey => {
      encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
    });

  document.getElementById('msgForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!encryptor) {
      alert('Chave pública não carregada.');
      return;
    }

    const mensagem = document.getElementById('mensagem').value;

    // 🔐 Gerar chave AES e IV aleatórios
    const chaveAES = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(16);

    // 🔒 Criptografar a mensagem com AES
    const encryptedMsg = CryptoJS.AES.encrypt(mensagem, chaveAES, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

    // 📦 Montar pacote da chave AES + IV
    const chavePacote = JSON.stringify({
      chave: chaveAES.toString(CryptoJS.enc.Hex),
      iv: iv.toString(CryptoJS.enc.Hex)
    });

    // 🔐 Criptografar chave + IV com RSA
    const encryptedKey = encryptor.encrypt(chavePacote);

    if (!encryptedKey) {
      alert('Erro na criptografia da chave.');
      return;
    }

    // 📤 Enviar dados ao servidor
    const formData = new FormData();
    formData.append('mensagem', encryptedMsg);
    formData.append('chave', encryptedKey);

    const response = await fetch('processa.php', {
      method: 'POST',
      body: formData
    });

    const resultado = await response.text();
    document.getElementById('resposta').textContent = resultado;
  });
});
