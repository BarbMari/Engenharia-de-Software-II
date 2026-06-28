<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conection.php';

try {
    $pdo = (new connection())->connect();

    $stmt = $pdo->query("
        SELECT Nome, Unidade
        FROM ProdutoEstoque
        ORDER BY Nome ASC
    ");

    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['sucesso' => true, 'produtos' => $produtos]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
}