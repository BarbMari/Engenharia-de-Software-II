<?php
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/conection.php';
$database = new connection();
$conecta = $database->connect();

$datainicio = $_GET['datainicio'] ?? null;
$ultimadata = $_GET['ultimadata'] ?? null;

if (!$datainicio || !$ultimadata) {

    echo json_encode([
        "erro" => "Datas não enviadas."
    ]);

    exit;

}


/* ✦── Gráfico dos ganhos diários ───────────────────────────────── */

$sql = "SELECT
            DataPedido,
            SUM(Valor) AS receita
        FROM venda
        WHERE DataPedido
        BETWEEN :datainicio
        AND :ultimadata
        GROUP BY DataPedido
        ORDER BY DataPedido ASC";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$receita_diaria = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* ✦── Ganhos totais ───────────────────────────────── */

$sql = "SELECT
            SUM(Valor) AS receita_total
        FROM venda
        WHERE DataPedido
        BETWEEN :datainicio
        AND :ultimadata";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$receita_total = $stmt->fetch(PDO::FETCH_ASSOC);

/* ✦── Maior venda ────────────────────────────────── */

$sql = "SELECT
            MAX(Valor) AS maior_venda
        FROM venda
        WHERE DataPedido
        BETWEEN :datainicio
        AND :ultimadata";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$maior_venda = $stmt->fetch(PDO::FETCH_ASSOC);
/* ✦── Menor venda ────────────────────────────────── */

$sql = "SELECT
            MIN(Valor) AS menor_venda
        FROM venda
        WHERE DataPedido
        BETWEEN :datainicio
        AND :ultimadata";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$menor_venda = $stmt->fetch(PDO::FETCH_ASSOC);

/* ✦── Ganhos médios diários ────────────────────────────────── */

$sql = "SELECT
            AVG(receita_dia) AS media_receita
        FROM (
            SELECT
                SUM(Valor) AS receita_dia
            FROM venda
            WHERE DataPedido
            BETWEEN :datainicio
            AND :ultimadata
            GROUP BY DataPedido
        ) AS receitas";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$media_receita = $stmt->fetch(PDO::FETCH_ASSOC);

/* ✦── Quantidade de pedidos ───────────────────────────────── */

$sql = "
        SELECT
        COUNT(*) AS quantidade_pedidos
        FROM venda  
        WHERE DataPedido BETWEEN :datainicio AND :ultimadata
";

$stmt = $conecta->prepare($sql);

$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
]);

$quantidade_pedidos = $stmt->fetch(PDO::FETCH_ASSOC);


echo json_encode([

    'receita_diaria' => $receita_diaria,

    'receita_total' => [
        'valor' => $receita_total['receita_total']
    ],

    'maior_venda' => [
        'valor' => $maior_venda['maior_venda']
    ],

    'menor_venda' => [
        'valor' => $menor_venda['menor_venda']
    ],

    'media_receita' => [
        'valor' => $media_receita['media_receita']
    ],

    'quantidade_pedidos' => [
        'valor' => $quantidade_pedidos['quantidade_pedidos']
    ]

]);
?>