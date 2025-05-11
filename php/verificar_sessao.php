<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['user_id'])) {
    echo json_encode(["logado" => true, "email" => $_SESSION['email']]);
} else {
    echo json_encode(["logado" => false]);
}
?>
