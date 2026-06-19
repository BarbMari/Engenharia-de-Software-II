<?php
$username='root';
$password='';
$dbname='pizzaria';
$host='localhost';
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sqlPizza = 'SELECT * FROM item';
    
    error_log("SQL: " . $sqlPizza);
    $dataPrep = $conn->prepare($sqlPizza);
    $dataPrep->execute([]);
    $pizzas = $dataPrep->fetchAll(PDO::FETCH_ASSOC);
    

    echo json_encode($pizzas);

} catch(PDOException $e) {echo 'ERRO ENCONTRADO: ' . $e->getMessage();}


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