<?php
header('Content-Type: application/json; charset=utf-8');

$username = 'root';
$password = '';
$dbname   = 'pizzaria';
$host     = 'localhost';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Filtra só os pedidos pendentes
    $stmt = $conn->prepare(
        "SELECT id, NomePedido, NomeCliente, Observacoes, Itens, Valor, Pagamento, Status
         FROM pedido
         WHERE Status = 'Pendente'
         ORDER BY id DESC
         LIMIT 50"
    );
    $stmt->execute();
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($pedidos as $p) {
        $itensTexto  = trim((string) ($p['Itens']       ?? ''));
        $observacoes = trim((string) ($p['Observacoes'] ?? ''));

        $result[] = [
            'id'          => (int) $p['id'],
            'nomePedido'  => $p['NomePedido'] ?? 'PEDIDO-' . $p['id'],
            'nomeCliente' => $p['NomeCliente'] ?? 'Cliente',
            'observacoes' => $observacoes,
            'itens'       => $itensTexto ?: $observacoes,
            'valor'       => floatval($p['Valor'] ?? 0),
            'pagamento'   => $p['Pagamento'] ?? 'indefinido',
            'status'      => $p['Status'] ?? 'Pendente',
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
