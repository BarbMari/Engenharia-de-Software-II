<?php
header('Content-Type: application/json; charset=utf-8');

$servername = 'localhost';
$database = 'pizzaria';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $error->getMessage()]);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true) ?: [];

$nomePedido = 'PEDIDO-' . substr(md5(uniqid((string) rand(), true)), 0, 12);
$nomeCliente = isset($data['nomeCliente']) ? trim($data['nomeCliente']) : '';
$observacoes = isset($data['observacoes']) ? trim($data['observacoes']) : '';
$pagamento = isset($data['formaPagamento']) ? trim($data['formaPagamento']) : '';
$itens = isset($data['itens']) ? trim($data['itens']) : '';
$valor = isset($data['total']) ? floatval($data['total']) : 0;

$stmt = $conn->prepare("INSERT INTO pedido (NomePedido, NomeCliente, Observacoes, Pagamento, Itens, Valor) VALUES (:nomePedido, :nomeCliente, :observacoes, :pagamento, :itens, :valor)");
$stmt->execute([
    ':nomePedido' => $nomePedido,
    ':nomeCliente' => $nomeCliente,
    ':observacoes' => $observacoes,
    ':pagamento' => $pagamento,
    ':itens' => $itens,
    ':valor' => $valor
]);

$pedidoId = $conn->lastInsertId();

$vendaStmt = $conn->prepare("INSERT INTO venda (IdPedido, Valor, Status, DataPedido, Pagamento) VALUES (:idPedido, :valor, :status, :dataPedido, :pagamento)");
$vendaStmt->execute([
    ':idPedido' => $pedidoId,
    ':valor' => $valor,
    ':status' => 'Processando',
    ':dataPedido' => date('Y-m-d'),
    ':pagamento' => $pagamento
]);

echo json_encode(['success' => true, 'pedidoId' => (int) $pedidoId]);
?>