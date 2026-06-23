<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../Engenharia-de-Software-II/Administrador/Js/conection.php';

$datainicio = $_GET['datainicio'] ?? null;
$ultimadata = $_GET['ultimadata'] ?? null;

$intervalo = isset($_GET['intervalo']) && is_numeric($_GET['intervalo']) ? intval($_GET['intervalo']) : 20;

if (!$datainicio|| !$ultimadata) {
    echo json_encode(["erro" => "Datas não enviadas"]);
    exit;
}

/* ✦── Gráfico da Umidade Externa ─────────────────────── */

$sql = "SELECT 
        datainclusao,
        horainclusao,
        he
        FROM leituramabel
        WHERE datainclusao 
        BETWEEN :datainicio AND :ultimadata
        ORDER BY datainclusao, horainclusao ASC";

$stmt = $conecta->prepare($sql);
$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata

]);

$dados_he_full = $stmt->fetchAll(PDO::FETCH_ASSOC);



/* ✦── Filtrando os dados ─────────────────────── */ 

$dados_he = array_filter($dados_he_full, function ($key) use ($intervalo) {
    return $key % $intervalo === 0;
}, ARRAY_FILTER_USE_KEY);

$dados_he = array_values($dados_he);



/* ✦── Gráfico da Média Diária ─────────────────────── */

$sql = "SELECT  datainclusao,
                AVG(he) as media_diaria
        FROM leituramabel
        WHERE datainclusao BETWEEN :datainicio AND :ultimadata
        GROUP BY datainclusao
        ORDER BY datainclusao ASC";

$stmt = $conecta->prepare($sql);
$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata

]);

$media_diaria_full = $stmt->fetchAll(PDO::FETCH_ASSOC);


/* ✦── Filtrando a média diária com base na distância das datas ─────────────────────── */

$total_dias = count($media_diaria_full);
$intervalo_media = $total_dias > 30 ? 2 : 1;

$media_diaria = array_filter($media_diaria_full, function ($key) use ($intervalo_media) {
    return $key % $intervalo_media === 0;
}, ARRAY_FILTER_USE_KEY);

$media_diaria = array_values($media_diaria);



/* ✦── Média Geral da HE ─────────────────────── */

$sql =  "SELECT AVG(he) as he_media
        FROM leituramabel
        WHERE datainclusao
        BETWEEN :datainicio AND :ultimadata";

$stmt = $conecta->prepare($sql);
$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata
    
]);

$media_geral = $stmt->fetch(PDO::FETCH_ASSOC);
$he_media = $media_geral["he_media"] ?? null;



/* ✦── Diferença da HI e HE ─────────────────────── */

$sql =  "SELECT AVG(hi - he) as hi_he_media
        FROM leituramabel
        WHERE datainclusao
        BETWEEN :datainicio 
        AND :ultimadata";


$stmt = $conecta->prepare($sql);
$stmt->execute([
    ':datainicio' => $datainicio,
    ':ultimadata' => $ultimadata

]);


$diferenca = $stmt->fetch(PDO::FETCH_ASSOC);
$hi_he_media = $diferenca["hi_he_media"] ?? null;



/* ✦── Enviando os dados para o JavaScript com JSON ─────────────────────── */

echo json_encode([
    'dados_he'        => $dados_he,
    'media_diaria'    => $media_diaria,
    'media_geral'     => ['he_media' => $he_media],
    'diferenca_hi_he' => ['hi_he_media' => $hi_he_media]
]);

?>