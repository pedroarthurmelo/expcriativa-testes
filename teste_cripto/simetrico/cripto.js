async function enviar(){
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Dados em formato JSON
    const dadosJSON = JSON.stringify({ email, senha });

    // Chave e IV de 16 bytes (AES-128-CBC)
    const chave = CryptoJS.enc.Utf8.parse('12345678ABCD1234'); // 16 caracteres
    const iv = CryptoJS.enc.Utf8.parse('4321432143214321');    // 16 caracteres

    // Criptografa os dados
    const dadosEncrypted = CryptoJS.AES.encrypt(dadosJSON, chave, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(); // importante: pega como string codificada em Base64

    // Envia com FormData
    const formData = new FormData();
    formData.append("dados", dadosEncrypted);

    const promisse = await fetch("cripto.php", {
        method: "POST",
        body: formData
    });

    //com json
    // const resposta = await promisse.json();
    // alert("Resposta do PHP: " + JSON.stringify(resposta));

    //com text
    const resposta = await promisse.text();
    window.alert(resposta);
}
