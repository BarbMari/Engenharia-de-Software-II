<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'seu_banco';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents('php://input'), true);

// CADASTRAR
if ($method === 'POST' && !isset($data['id'])) {
    $stmt = $conn->prepare("INSERT INTO Funcionario (NomeCompleto, Email, CPF, Telefone, Cargo) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $data['NomeCompleto'], $data['Email'], $data['CPF'], $data['Telefone'], $data['Cargo']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário cadastrado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar: ' . $conn->error]);
    }
}

// EDITAR
if ($method === 'POST' && isset($data['id'])) {
    $stmt = $conn->prepare("UPDATE Funcionario SET NomeCompleto=?, Email=?, CPF=?, Telefone=?, Cargo=? WHERE id=?");
    $stmt->bind_param("sssssi", $data['NomeCompleto'], $data['Email'], $data['CPF'], $data['Telefone'], $data['Cargo'], $data['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário atualizado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar: ' . $conn->error]);
    }
}

// EXCLUIR
if ($method === 'DELETE') {
    $stmt = $conn->prepare("DELETE FROM Funcionario WHERE id=?");
    $stmt->bind_param("i", $data['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário excluído!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir: ' . $conn->error]);
    }
}

// BUSCAR POR ID (para preencher form de edição)
if ($method === 'GET' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $result = $conn->query("SELECT * FROM Funcionario WHERE id=$id");
    echo json_encode($result->fetch_assoc());
}
