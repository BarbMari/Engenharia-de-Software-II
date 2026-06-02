<?php
header('Content-Type: application/json; charset=utf-8');
$username='';
$password='';
$dbname='pizzaria';
$host='localhost';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get orders that are in 'Processando' status (pending)
    $sql = 'SELECT p.id, p.NomePedido, p.NomeCliente, p.Observacoes, p.Itens, 
                   v.Valor, v.Status, v.DataPedido, v.Pagamento
            FROM Pedido p
            LEFT JOIN Venda v ON p.id = v.IdPedido
            WHERE v.Status = "Processando" OR v.Status IS NULL
            ORDER BY v.DataPedido DESC, p.id DESC
            LIMIT 50';
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse observações (which may contain item list) to display
    $result = [];
    foreach ($pedidos as $p) {
        $result[] = [
            'id' => $p['id'],
            'nomePedido' => $p['NomePedido'] ?? 'PEDIDO-' . $p['id'],
            'nomeCliente' => $p['NomeCliente'] ?? 'Cliente',
            'observacoes' => $p['Observacoes'] ?? '',
            'valor' => floatval($p['Valor'] ?? 0),
            'status' => $p['Status'] ?? 'Novo',
            'dataPedido' => $p['DataPedido'],
            'pagamento' => $p['Pagamento'],
            'qtdItens' => intval($p['Itens'] ?? 0)
        ];
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
