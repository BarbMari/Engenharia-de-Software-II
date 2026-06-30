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
        $stmt = $pdo->prepare('DELETE FROM venda WHERE id = :id');
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
    $status         = $_POST['status']      ?? '';
    $data           = $_POST['data']        ?? '';
    $valor          = $_POST['valor']       ?? 0;
    $pagamento      = $_POST['pagamento']   ?? '';

    if (!$id) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID não informado']);
        exit;
    }

    try {
        $pdo = (new connection())->connect();

        $sql = "UPDATE venda
                SET DataPedido = :dataP,
                    Pagamento = :pagamento,
                    Valor = :valor,
                    `Status` = :estatus
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'        => $id,
            ':estatus'     => $status,
            ':dataP' => $data,
            ':valor'     => $valor,
            ':pagamento'       => $pagamento    
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

$dataI        = trim($_GET['dataI']         ?? '');
$dataF        = trim($_GET['dataF']         ?? '');
$status       = trim($_GET['status']        ?? '');

$where  = [];
$params = [];

if ($dataI !== '') {
    $where[]         = 'DataPedido >= :dataI';
    $params[':dataI'] = '%' . $dataI . '%';
}
if ($dataF !== '') {
    $where[]         = 'dataF <= :dataF';
    $params[':dataF'] = '%' . $dataF . '%';
}
if ($status !== '') {
    $where[]         = 'Status LIKE :status';
    $params[':status'] = '%' . $status . '%';
}

$sql = "SELECT
            id,
            idPedido,
            Pagamento,
            DataPedido,
            Valor,
            `Status`
        FROM venda ";

if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);

try {
    $pdo  = (new connection())->connect();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $venda = $stmt->fetchAll();

    echo json_encode([
        'sucesso'      => true,
        'total'        => count($venda),
        'totalvendas' => array_sum(array_column($venda, 'ValorTotal')),
        'vendas'     => $venda,
    ]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro na consulta: ' . $e->getMessage()]);
}