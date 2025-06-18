document.getElementById('msgForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const mensagem = document.getElementById('mensagem').value;

  // Gere uma chave e IV aleatórios
  const chave = CryptoJS.lib.WordArray.random(16); // 128-bit key
  const iv = CryptoJS.lib.WordArray.random(16);    // 128-bit IV

  // Criptografar a mensagem
  const encrypted = CryptoJS.AES.encrypt(mensagem, chave, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Enviar via fetch com FormData
  const formData = new FormData();
  formData.append('mensagem', encrypted.toString());              // base64
  formData.append('iv', iv.toString(CryptoJS.enc.Hex));           // hex
  formData.append('chave', chave.toString(CryptoJS.enc.Hex));     // hex

  const response = await fetch('processa.php', {
    method: 'POST',
    body: formData
  });

  const resultado = await response.text();
  document.getElementById('resposta').textContent = resultado;
});
