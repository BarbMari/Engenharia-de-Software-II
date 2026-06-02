<?php
header('Content-Type: application/json; charset=utf-8');
$username='';
$password='';
$dbname='pizzaria';
$host='localhost';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read JSON payload
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    
    $nomeCliente = $data['nomeCliente'] ?? 'Cliente';
    $observacoes = $data['observacoes'] ?? '';
    $formaPagamento = $data['formaPagamento'] ?? 'indefinido';
    $itens = $data['itens'] ?? [];
    
    if (empty($itens)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Pedido sem itens']);
        exit;
    }
    
    // Save Pedido record
    $sqlPedido = 'INSERT INTO Pedido (NomePedido, NomeCliente, Observacoes, Itens) VALUES (?, ?, ?, ?)';
    $stmtPedido = $conn->prepare($sqlPedido);
    $numItens = count($itens);
    $stmtPedido->execute([
        uniqid('PEDIDO-'),
        $nomeCliente,
        $observacoes,
        $numItens
    ]);
    
    $pedidoId = $conn->lastInsertId();
    
    // Save Venda record (sale/order details)
    $totalValor = array_sum(array_map(fn($it) => $it['valor'] * $it['quantidade'], $itens));
    $sqlVenda = 'INSERT INTO Venda (IdPedido, Valor, Status, DataPedido, Pagamento) VALUES (?, ?, ?, ?, ?)';
    $stmtVenda = $conn->prepare($sqlVenda);
    $stmtVenda->execute([
        $pedidoId,
        $totalValor,
        'Processando',
        date('Y-m-d'),
        $formaPagamento
    ]);
    
    // Note: Ideally we'd also insert into Item table or a junction table (PedidoItem) to track which items were in this order
    // For now, storing in Observacoes is a workaround. In production, create a PedidoItem table.
    
    echo json_encode([
        'success' => true,
        'pedidoId' => $pedidoId,
        'message' => 'Pedido salvo com sucesso'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
