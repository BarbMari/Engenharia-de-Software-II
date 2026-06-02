<?php
header("Content-Type: application/json");
require_once "conection.php";

$sql = "SELECT id, NomeCompleto, Email, Telefone, Cargo, CPF FROM Funcionario ORDER BY id DESC";
$result = $conn->query($sql);

$funcionarios = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $funcionarios[] = $row;
    }
}

echo json_encode($funcionarios);
$conn->close();
?>