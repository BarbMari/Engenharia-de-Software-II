<?php
header("Content-Type: application/json");
require_once "conection.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Nenhum dado recebido pelo servidor."]);
    exit;
}

$id = isset($data['id']) ? intval($data['id']) : 0;
$nomeCompleto = $conn->real_escape_string($data['NomeCompleto']);
$email = $conn->real_escape_string($data['Email']);
$cpf = $conn->real_escape_string($data['CPF']);
$telefone = $conn->real_escape_string($data['Telefone']);
$cargo = $conn->real_escape_string($data['Cargo']);

if (empty($nomeCompleto) || empty($email) || empty($cpf) || empty($cargo)) {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
    exit;
}

if ($id > 0) {
    // Atualizar funcionário existente
    $sql = "UPDATE Funcionario SET 
            NomeCompleto = '$nomeCompleto', 
            Email = '$email', 
            CPF = '$cpf', 
            Telefone = '$telefone', 
            Cargo = '$cargo' 
            WHERE id = $id";
    $message = "Funcionário atualizado com sucesso!";
} else {
    // Inserir novo funcionário
    $sql = "INSERT INTO Funcionario (NomeCompleto, Email, CPF, Telefone, Cargo) 
            VALUES ('$nomeCompleto', '$email', '$cpf', '$telefone', '$cargo')";
    $message = "Funcionário cadastrado com sucesso!";
}

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => $message]);
} else {
    echo json_encode(["success" => false, "message" => "Erro no banco de dados: " . $conn->error]);
}

$conn->close();
?>