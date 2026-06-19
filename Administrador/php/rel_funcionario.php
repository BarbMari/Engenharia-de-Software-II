<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'pizzaria';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão.']);
    exit;
}

$sql = "SELECT * FROM Funcionario WHERE 1=1";

if (!empty($_GET['nome'])) {
    $nome = $conn->real_escape_string($_GET['nome']);
    $sql .= " AND NomeCompleto LIKE '%$nome%'";
}

if (!empty($_GET['email'])) {
    $email = $conn->real_escape_string($_GET['email']);
    $sql .= " AND Email LIKE '%$email%'";
}

if (!empty($_GET['cpf'])) {
    $cpf = $conn->real_escape_string(preg_replace('/\D/', '', $_GET['cpf']));
    $sql .= " AND CPF LIKE '%$cpf%'";
}

if (!empty($_GET['cargo'])) {
    $cargo = $conn->real_escape_string($_GET['cargo']);
    $sql .= " AND Cargo = '$cargo'";
}

$sql .= " ORDER BY NomeCompleto ASC";

$result = $conn->query($sql);
$funcionarios = [];
while ($row = $result->fetch_assoc()) {
    $funcionarios[] = $row;
}

echo json_encode($funcionarios);
