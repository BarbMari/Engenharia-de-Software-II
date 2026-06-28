<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'pizzaria';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro de conexão: ' . $conn->connect_error]);
    exit;
}

$action = $_REQUEST['action'] ?? 'list';

// ---------------------------------------------------------
// LISTAR / FILTRAR
// ---------------------------------------------------------
if ($action === 'list') {

    $sql = "SELECT * FROM item WHERE Tipo IN ('Salgada', 'Vegetariana', 'Doce')";

    if (!empty($_GET['nome'])) {
        $nome = $conn->real_escape_string($_GET['nome']);
        $sql .= " AND Nome LIKE '%$nome%'";
    }

    if (!empty($_GET['tipo'])) {
        $tipo = $conn->real_escape_string($_GET['tipo']);
        $sql .= " AND Tipo = '$tipo'";
    }

    if (!empty($_GET['molho'])) {
        $molho = $conn->real_escape_string($_GET['molho']);
        $sql .= " AND Igredientes LIKE '%$molho%'";
    }

    if (!empty($_GET['queijo'])) {
        $queijo = $conn->real_escape_string($_GET['queijo']);
        $sql .= " AND Igredientes LIKE '%$queijo%'";
    }

    if (!empty($_GET['ingredientes'])) {
        $ingredientes = array_filter(array_map('trim', explode(',', $_GET['ingredientes'])));
        foreach ($ingredientes as $ingrediente) {
            $ingrediente = $conn->real_escape_string($ingrediente);
            $sql .= " AND Igredientes LIKE '%$ingrediente%'";
        }
    }

    if (isset($_GET['precoMin']) && $_GET['precoMin'] !== '') {
        $precoMin = $conn->real_escape_string($_GET['precoMin']);
        $sql .= " AND Valor >= '$precoMin'";
    }

    if (isset($_GET['precoMax']) && $_GET['precoMax'] !== '') {
        $precoMax = $conn->real_escape_string($_GET['precoMax']);
        $sql .= " AND Valor <= '$precoMax'";
    }

    $sql .= " ORDER BY Nome ASC";

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(['sucesso' => false, 'erro' => 'Erro na consulta: ' . $conn->error]);
        exit;
    }

    $itens = [];
    while ($row = $result->fetch_assoc()) {
        $itens[] = $row;
    }

    echo json_encode(['sucesso' => true, 'itens' => $itens]);
    exit;
}

// ---------------------------------------------------------
// EXCLUIR
// ---------------------------------------------------------
if ($action === 'delete') {

    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(['sucesso' => false, 'erro' => 'ID não informado']);
        exit;
    }

    $id = (int) $id;

    $stmt = $conn->prepare("DELETE FROM item WHERE id = ?");
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => $stmt->error]);
    }
    exit;
}

// ---------------------------------------------------------
// ATUALIZAR
// ---------------------------------------------------------
if ($action === 'update') {

    $id           = $_POST['id'] ?? null;
    $nome         = $_POST['nom'] ?? '';
    $tipo         = $_POST['fla'] ?? '';
    $valor        = $_POST['val'] ?? 0;
    $imagem       = $_POST['img'] ?? '';
    $resumo       = $_POST['res'] ?? '';
    $ingredientes = $_POST['ing'] ?? '';

    if (!$id) {
        echo json_encode(['sucesso' => false, 'erro' => 'ID não informado']);
        exit;
    }

    $id = (int) $id;

    $stmt = $conn->prepare(
        "UPDATE item
         SET Nome = ?, Tipo = ?, Valor = ?, Imagem = ?, Resumo = ?, Igredientes = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        'ssdsssi',
        $nome,
        $tipo,
        $valor,
        $imagem,
        $resumo,
        $ingredientes,
        $id
    );

    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => $stmt->error]);
    }
    exit;
}

echo json_encode(['sucesso' => false, 'erro' => 'Ação inválida']);