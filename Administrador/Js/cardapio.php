
<?php
header('Content-Type: application/json; charset=utf-8');
$username='';
$password='';
$dbname='pizzaria';
$host='localhost';
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read all menu items from the Item table. Fields in DB: id, Nome, Valor, Imagem, Resumo, Igredientes, Tipo, Venda
    $sql = 'SELECT id, Nome, Valor, Imagem, Resumo, Igredientes, Tipo, Venda FROM Item';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $items = [];
    foreach ($rows as $r) {
        $img = null;
        if (!empty($r['Imagem'])) {
            // Imagen may be stored as blob; encode as data URL so frontend can display it
            $base = base64_encode($r['Imagem']);
            // assume PNG by default — adjust if you store another format
            $img = 'data:image/png;base64,' . $base;
        }
        $items[] = [
            'id' => $r['id'],
            'nome' => $r['Nome'],
            'preco' => isset($r['Valor']) ? floatval($r['Valor']) : 0.0,
            'imagem' => $img,
            'resumo' => $r['Resumo'] ?? null,
            'ingredientes' => $r['Igredientes'] ?? null,
            'tipo' => $r['Tipo'] ?? null,
            'venda' => !empty($r['Venda'])
        ];
    }

    echo json_encode($items, JSON_UNESCAPED_UNICODE);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}


/*
console.log(`./ptqa.php?dataStart=${formatDate(dataStart)}&dataEnd=${formatDate(dataEnd)}`);
        fetch(`./ptqa.php?dataStart=${formatDate(dataStart)}&dataEnd=${formatDate(dataEnd)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
*/