const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyBOrzYdKpWMkFRLCVd0A
DH7XoTQTk65ZNURZI3Rr5D/B6xUeJk9Aw3KU0S8e9726vfObBM1wCekD0hUsowGo
EQCHMrYmG8LZLMc2ei7E+QptpciImzvgb5jM3yyWhtmh5gzCMysgcZ7qYu5atW1S
zDZO+ozcmCPT0lZafhCYeRu3l0IS0/NeLKxbftg4/afeKyI1GMtQJblCggmqPNAE
mqCjqUc17PafDPmxSnZ6EwnLUGmjfW9yFp1ydE7xXBkvdzhChfhGfxXERhjnLdeU
+eal0PcNffR9N9IONe/0KyFuDX/jWNQNOOGDYxRQm0MD+RhqHeUWfzitRIy5Jo9v
pQIDAQAB
-----END PUBLIC KEY-----
`;

function encryptData() {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);

    const message = document.getElementById('messageInput').value;

    if (!message) {
        alert('Por favor, digite uma mensagem para criptografar.');
        return;
    }

    const encrypted = encrypt.encrypt(message);

    if (encrypted) {
        document.getElementById('encryptedOutput').value = encrypted;
        console.log('Mensagem Criptografada:', encrypted);

        // Enviar para o servidor (exemplo com fetch API)
        sendToServer(encrypted);
    } else {
        alert('Erro ao criptografar a mensagem. Verifique o tamanho da mensagem e a chave pública.');
    }
}

async function sendToServer(encryptedMessage) {
    try {
        const response = await fetch('assimetrico.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedMessage: encryptedMessage }),
        });

        const data = await response.text(); // Ou response.json() se o PHP retornar JSON
        document.getElementById('serverResponse').innerText = 'Resposta do Servidor: ' + data;
        console.log('Resposta do Servidor:', data);

    } catch (error) {
        console.error('Erro ao enviar para o servidor:', error);
        document.getElementById('serverResponse').innerText = 'Erro ao enviar para o servidor.';
    }
}