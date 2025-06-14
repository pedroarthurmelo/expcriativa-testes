<?php
require_once __DIR__ . '/config.php';

echo "Host do banco: " . ($_ENV['DB_HOST'] ?? 'Não encontrado') . "<br>";
echo "Usuário do banco: " . ($_ENV['DB_USER'] ?? 'Não encontrado') . "<br>";
echo "Senha do banco: " . ($_ENV['DB_PASS'] ?? 'Não encontrado') . "<br>";
echo "Nome do banco: " . ($_ENV['DB_NAME'] ?? 'Não encontrado') . "<br><br>";
echo "Servidor SMTP: " . ($_ENV['MAIL_HOST'] ?? 'Não encontrado') . "<br>";
echo "Porta SMTP: " . ($_ENV['MAIL_PORT'] ?? 'Não encontrado') . "<br>";
echo "Criptografia SMTP: " . ($_ENV['MAIL_ENCRYPTION'] ?? 'Não encontrado') . "<br>";
echo "Usuário do e-mail (remetente): " . ($_ENV['MAIL_USERNAME'] ?? 'Não encontrado') . "<br>";
echo "Senha do e-mail (remetente): " . ($_ENV['MAIL_PASSWORD'] ?? 'Não encontrado') . "<br>";
echo "E-mail do remetente: " . ($_ENV['MAIL_FROM'] ?? 'Não encontrado') . "<br>";
echo "Nome do remetente: " . ($_ENV['MAIL_FROM_NAME'] ?? 'Não encontrado') . "<br>";
?>
