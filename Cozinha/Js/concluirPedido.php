<?php
header('Content-Type: application/json; charset=utf-8');

$username = 'root';
$password = '';
$dbname   = 'pizzaria';
$host     = 'localhost';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $e->getMessage()]);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do pedido não informado']);
    exit;
}

$pedidoId = (int) $data['id'];

try {
    $stmt = $conn->prepare("UPDATE pedido SET Status = 'Concluido' WHERE id = :id");
    $stmt->bindParam(':id', $pedidoId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Pedido marcado como concluído']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pedido não encontrado']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao concluir pedido: ' . $e->getMessage()]);
}
?>
