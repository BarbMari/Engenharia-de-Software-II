<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conection.php';

// ── Filtros via GET ───────────────────────────────────────────────────────────
$nome         = trim($_GET['nome']         ?? '');
$categoria    = trim($_GET['categoria']    ?? '');
$unidade      = trim($_GET['unidade']      ?? '');
$status       = trim($_GET['status']       ?? '');
$dataEntrada  = trim($_GET['dataEntrada']  ?? '');
$dataValidade = trim($_GET['dataValidade'] ?? '');
$ordemQtd     = $_GET['ordemQtd']          ?? '';
$ordemPreco   = $_GET['ordemPreco']        ?? '';

// ── Monta WHERE ───────────────────────────────────────────────────────────────
$where  = [];
$params = [];

if ($nome !== '') {
    $where[]         = 'Nome LIKE :nome';
    $params[':nome'] = '%' . $nome . '%';
}
if ($categoria !== '') {
    $where[]              = 'Categoria = :categoria';
    $params[':categoria'] = $categoria;
}
if ($unidade !== '') {
    $where[]            = 'Unidade = :unidade';
    $params[':unidade'] = $unidade;
}
if ($dataEntrada !== '') {
    $where[]                 = 'DataEntrega = :dataEntrada';
    $params[':dataEntrada']  = $dataEntrada;
}
if ($dataValidade !== '') {
    $where[]                  = 'DataValidade = :dataValidade';
    $params[':dataValidade']  = $dataValidade;
}
if ($status === 'Sem estoque')   $where[] = 'Quantidade = 0';
if ($status === 'Baixo estoque') $where[] = 'Quantidade > 0 AND Quantidade <= 5';
if ($status === 'Disponível')    $where[] = 'Quantidade > 5';

// ── Monta ORDER BY (sem concatenar input direto — usa whitelist) ──────────────
$ordens = [];
if (in_array($ordemQtd,   ['asc','desc'])) $ordens[] = 'Quantidade '  . strtoupper($ordemQtd);
if (in_array($ordemPreco, ['asc','desc'])) $ordens[] = 'CustoTotal '  . strtoupper($ordemPreco);

// ── Query ─────────────────────────────────────────────────────────────────────
$sql = "SELECT
            id,
            Nome,
            Categoria,
            Unidade,
            Quantidade,
            CustoUn,
            (Quantidade * CustoUn) AS CustoTotal,
            DataEntrega,
            DataValidade,
            CASE
                WHEN Quantidade = 0  THEN 'Sem estoque'
                WHEN Quantidade <= 5 THEN 'Baixo estoque'
                ELSE 'Disponível'
            END AS Status
        FROM ProdutoEstoque";

if ($where)  $sql .= ' WHERE '    . implode(' AND ', $where);
$sql .= $ordens ? ' ORDER BY ' . implode(', ', $ordens) : ' ORDER BY id DESC';

// ── Executa ───────────────────────────────────────────────────────────────────
try {
    $pdo  = (new connection())->connect();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $produtos = $stmt->fetchAll();

    echo json_encode([
        'sucesso'      => true,
        'total'        => count($produtos),
        'totalEstoque' => array_sum(array_column($produtos, 'CustoTotal')),
        'produtos'     => $produtos,
    ]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro na consulta: ' . $e->getMessage()]);
}