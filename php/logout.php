<?php
session_start();
session_destroy(); // Destroi todos os dados da sessão
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Logout</title>
    <script>
        alert("Você foi deslogado com sucesso!");
        window.location.href = "../html/login.html"; // Redireciona para a página de login
    </script>
</head>
<body>
</body>
</html>
