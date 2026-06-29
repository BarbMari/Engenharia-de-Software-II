<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

$host   = 'localhost';
$db     = 'pizzaria';
$user   = 'root';
$pass   = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão']);
    exit;
}

$data  = json_decode(file_get_contents('php://input'), true);
$login = trim($data['login'] ?? '');
$senha = trim($data['senha'] ?? '');

if (!$login || !$senha) {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, NomeCompleto, Cargo, Senha FROM funcionario WHERE Usuario = :login LIMIT 1");
$stmt->execute([':login' => $login]);
$func = $stmt->fetch();

if (!$func || $func['Senha'] !== $senha) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos']);
    exit;
}

// Normaliza o cargo para comparação
$cargo = strtolower(trim($func['Cargo']));

// Define o papel: admin, funcionario ou cozinheiro
if (in_array($cargo, ['gerente', 'admin', 'administrador'])) {
    $papel = 'admin';
} elseif (in_array($cargo, ['cozinheiro', 'cozinha', 'pizzaiolo'])) {
    $papel = 'cozinheiro';
} else {
    $papel = 'funcionario';
}

echo json_encode([
    'success' => true,
    'nome'    => $func['NomeCompleto'],
    'cargo'   => $func['Cargo'],
    'papel'   => $papel,  // 'admin' | 'funcionario' | 'cozinheiro'
]);
?>
