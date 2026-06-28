<?php
header('Content-Type: application/json');

$servername = "localhost";
$database   = "pizzaria";
$username   = "root";
$password   = "";

try {
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$database;charset=utf8",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $error->getMessage()]);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Payload inválido']);
    exit;
}

$nomeCliente    = $data['nomeCliente']    ?? '';
$itens          = $data['itens']          ?? '';
$observacoes    = $data['observacoes']    ?? '';
$formaPagamento = $data['formaPagamento'] ?? '';
$total          = $data['total']          ?? 0;

$nomePedido = 'PEDIDO-' . rand(1000000, 9999999);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO pedido (NomePedido, NomeCliente, Observacoes, Pagamento, Itens, Valor, Status)
         VALUES (:nom, :nomc, :obs, :pag, :itn, :val, 'Pendente')"
    );

    $stmt->bindParam(':nom',  $nomePedido);
    $stmt->bindParam(':nomc', $nomeCliente);
    $stmt->bindParam(':obs',  $observacoes);
    $stmt->bindParam(':pag',  $formaPagamento);
    $stmt->bindParam(':itn',  $itens);
    $stmt->bindParam(':val',  $total);

    $stmt->execute();
    $pedidoId = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'pedidoId' => $pedidoId]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
