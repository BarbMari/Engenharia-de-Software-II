<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit;
}

// ── Coleta e valida ──────────────────────────────────────────────────────────
$nome         = trim($_POST['nomeProduto']   ?? '');
$categoria    = trim($_POST['categoria']     ?? '');
$quantidade   = $_POST['quantidade']          ?? '';
$unidade      = trim($_POST['unidade']       ?? '');
$custoUn      = $_POST['custoUnitario']       ?? '';
$dataEntrada  = $_POST['dataEntrada']         ?? '';
$dataValidade = $_POST['dataValidade']        ?? '';

if (!$nome || !$categoria || $quantidade === '' || !$unidade ||
    $custoUn === '' || !$dataEntrada || !$dataValidade) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos.']);
    exit;
}

$quantidade = (int)   $quantidade;
$custoUn    = (float) $custoUn;

// ── Insert ────────────────────────────────────────────────────────────────────
try {
    $pdo = (new connection())->connect();

    $stmt = $pdo->prepare("
        INSERT INTO ProdutoEstoque
            (Nome, Categoria, Quantidade, Unidade, CustoUn, DataEntrega, DataValidade)
        VALUES
            (:nome, :categoria, :quantidade, :unidade, :custoUn, :dataEntrada, :dataValidade)
    ");

    $stmt->execute([
        ':nome'         => $nome,
        ':categoria'    => $categoria,
        ':quantidade'   => $quantidade,
        ':unidade'      => $unidade,
        ':custoUn'      => $custoUn,
        ':dataEntrada'  => $dataEntrada,
        ':dataValidade' => $dataValidade,
    ]);

    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Produto cadastrado com sucesso!',
        'produto'  => [
            'id'           => $pdo->lastInsertId(),
            'nome'         => $nome,
            'categoria'    => $categoria,
            'unidade'      => $unidade,
            'quantidade'   => $quantidade,
            'custoUn'      => $custoUn,
            'custoTotal'   => $quantidade * $custoUn,
            'dataEntrada'  => $dataEntrada,
            'dataValidade' => $dataValidade,
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao salvar: ' . $e->getMessage()]);
}