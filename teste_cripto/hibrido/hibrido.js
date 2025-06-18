let rsaPublicKey = '';

//PASSO 1
//faz um fetch para o servidor para pedir a chave PUBLICA CARAIO--------------------------------------
async function fetchPublicKey() {
    try {
        const response = await fetch('publicKey.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rsaPublicKey = await response.text();
        console.log('Chave Pública RSA obtida:', rsaPublicKey);
        return rsaPublicKey; // Retorna a chave para ser usada
    } catch (error) {
        console.error('Erro ao obter a chave pública:', error);
        alert('Não foi possível obter a chave pública do servidor. Verifique o console.');
        return null;
    }
}

//PASSO 2
//função para gerar uma chave simetrica AES aleatória---------------------------------------------------
function generateAesKey() {
    // Gerar uma chave AES aleatória de 256 bits (32 bytes)
    // O CryptoJS.lib.WordArray.random(bytes) gera bytes aleatórios
    const key = CryptoJS.lib.WordArray.random(32); // 256 bits
    const iv = CryptoJS.lib.WordArray.random(16);  // 128 bits para IV (Initialization Vector)

    // A chave AES é um WordArray, podemos convertê-la para string Base64 se necessário
    // para passá-la para JSEncrypt, mas JSEncrypt aceita string UTF-8.
    // É mais seguro passar a chave como string hex ou base64 para JSEncrypt.
    return {
        key: key.toString(CryptoJS.enc.Base64), // Chave em Base64
        iv: iv.toString(CryptoJS.enc.Hex)      // IV em Hex para compatibilidade
    };
}

//PASSO 3 
// Usando a chave AES e IV gerados - criptografa a mensagem com a chave simetrica-----------------------------
function encryptMessageAes(message, aesKeyBase64, aesIvHex) {
    const aesKey = CryptoJS.enc.Base64.parse(aesKeyBase64); // Converter de volta para WordArray
    const aesIv = CryptoJS.enc.Hex.parse(aesIvHex);        // Converter de volta para WordArray

    const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
        iv: aesIv,
        mode: CryptoJS.mode.CBC, // Ou outro modo, como CTR ou GCM (se a Web Crypto API)
        padding: CryptoJS.pad.Pkcs7 // Padrão de padding
    });
    return encrypted.toString(); // Retorna a mensagem criptografada em Base64
}

//PASSO 4
// criptografa a chave simetrica com a chave publica------------------------------------------------------
function encryptAesKeyWithRsa(aesKeyBase64, rsaPublicKey) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(rsaPublicKey);

    // Criptografe a chave AES (que está em Base64)
    const encryptedAesKey = encrypt.encrypt(aesKeyBase64);

    if (!encryptedAesKey) {
        throw new Error("Falha ao criptografar a chave AES com RSA. Verifique o tamanho da chave e da mensagem.");
    }
    return encryptedAesKey; // Retorna a chave AES criptografada em Base64
}

//PASSO 5
// Envia para o servidor a mensagem junto com a chave simetrica criptografados com a CHAVE PUBLICA

async function sendEncryptedData() {
    const messageInput = document.getElementById('messageInput').value;
    if (!messageInput) {
        alert('Por favor, digite uma mensagem para enviar.');
        return;
    }

    // 1. Obter chave pública RSA (se ainda não obtida)
    if (!rsaPublicKey) {
        const fetchedKey = await fetchPublicKey();
        if (!fetchedKey) return; // Parar se não conseguir a chave
    }

    // 2. Gerar chave simétrica (AES)
    const aesPair = generateAesKey(); // { key: base64_key, iv: hex_iv }

    // 3. Criptografar a mensagem com AES
    const encryptedMessageAes = encryptMessageAes(messageInput, aesPair.key, aesPair.iv);

    // 4. Criptografar a chave AES com RSA
    const encryptedAesKeyRsa = encryptAesKeyWithRsa(aesPair.key, rsaPublicKey);

    // 5. Enviar para o servidor
    try {
        const response = await fetch('hibrido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                encryptedMessage: encryptedMessageAes,
                encryptedAesKey: encryptedAesKeyRsa,
                aesIv: aesPair.iv // O IV não precisa ser criptografado, apenas enviado
            }),
        });

        const data = await response.text();
        document.getElementById('serverResponse').innerText = 'Resposta do Servidor: ' + data;
        console.log('Resposta do Servidor:', data);

    } catch (error) {
        console.error('Erro ao enviar dados criptografados:', error);
        document.getElementById('serverResponse').innerText = 'Erro ao enviar dados.';
    }
}