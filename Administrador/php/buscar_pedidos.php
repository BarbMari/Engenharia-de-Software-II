<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conection.php';

$action = $_REQUEST['action'] ?? 'list';

// ───────────────────────────────────────────────────────────────────────────
// EXCLUIR
// ───────────────────────────────────────────────────────────────────────────
if ($action === 'delete') {

    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID não informado']);
        exit;
    }

    try {
        $pdo  = (new connection())->connect();
        $stmt = $pdo->prepare('DELETE FROM pedido WHERE id = :id');
        $stmt->execute([':id' => $id]);

        echo json_encode(['sucesso' => true]);
    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir: ' . $e->getMessage()]);
    }
    exit;
}

// ───────────────────────────────────────────────────────────────────────────
// ATUALIZAR
// ───────────────────────────────────────────────────────────────────────────
if ($action === 'update') {

    $id             = $_POST['id']          ?? null;
    $nomeP          = $_POST['nomeP']       ?? '';
    $nomeC          = $_POST['nomeC']       ?? '';
    $pagamento      = $_POST['pagamento']   ?? '';
    $valor          = $_POST['valor']       ?? 0;
    $obs            = $_POST['obs']         ?? '';
    $itens          = $_POST['itens']       ?? '';
    $status         = $_POST['status']      ?? '';

    if (!$id) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID não informado']);
        exit;
    }

    try {
        $pdo = (new connection())->connect();

        $sql = "UPDATE pedido
                SET NomePedido = :nomeP,
                    NomeCliente = :nomeC,
                    Pagamento = :pagamento,
                    Valor = :valor,
                    Observacoes = :obs,
                    Itens = :itens,
                    `Status` = :estatus
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'        => $id,
            ':nomeP'     => $nomeP,
            ':nomeC'     => $nomeC,
            ':pagamento' => $pagamento,
            ':valor'     => $valor,
            ':obs'       => $obs,
            ':itens'     => $itens,
            ':estatus'     => $status,
        ]);

        echo json_encode(['sucesso' => true]);
    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao atualizar: ' . $e->getMessage()]);
    }
    exit;
}

// ───────────────────────────────────────────────────────────────────────────
// LISTAR / FILTRAR
// ───────────────────────────────────────────────────────────────────────────

$nomeP        = trim($_GET['nomeP']         ?? '');
$nomeC        = trim($_GET['nomeC']         ?? '');
$pagamento    = trim($_GET['pagamento']     ?? '');
$status       = trim($_GET['status']        ?? '');

$where  = [];
$params = [];

if ($nomeP !== '') {
    $where[]         = 'NomePedido LIKE :nomeP';
    $params[':nomeP'] = '%' . $nomeP . '%';
}
if ($nomeC !== '') {
    $where[]         = 'NomeCliente LIKE :nomeC';
    $params[':nomeC'] = '%' . $nomeC . '%';
}
if ($status !== '') {
    $where[]         = 'Status LIKE :status';
    $params[':status'] = '%' . $status . '%';
}
if ($pagamento !== '') {
    $where[]         = 'Pagamento LIKE :pagamento';
    $params[':pagamento'] = '%' . $pagamento . '%';
}

$sql = "SELECT
            id,
            NomePedido,
            NomeCliente,
            Observacoes,
            Pagamento,
            Itens,
            Valor,
            `Status`
        FROM pedido ";

if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);

try {
    $pdo  = (new connection())->connect();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $pedidos = $stmt->fetchAll();

    echo json_encode([
        'sucesso'      => true,
        'total'        => count($pedidos),
        'totalPedidos' => array_sum(array_column($pedidos, 'ValorTotal')),
        'pedidos'     => $pedidos,
    ]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro na consulta: ' . $e->getMessage()]);
}