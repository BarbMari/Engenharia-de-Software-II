<?php
$servername = "localhost";
$database = "pizzaria"; 
$username = "root";
$password = "";
$sql = "mysql:host=$servername;dbname=$database;";
$dsn_Options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
try { 
  $my_Db_Connection = new PDO($sql, $username, $password, $dsn_Options);
  echo "Connected successfully";
} catch (PDOException $error) {
  echo 'Connection error: ' . $error->getMessage();
}

<<<<<<< Updated upstream
$nom = 'PEDIDO-' + rand(1000000,9999999);
$nomc = $_POST['nomc']; 
$itn = $_POST['itn'];
$obs = $_POST['obs']; 
$pag = $_POST['pag']; 

$my_Insert_Statement = $my_Db_Connection->prepare("INSERT INTO pedido (NomePedido, NomeCliente, Observacoes, Pagamento, Itens) VALUES (:nom, :nomc, :obs, :pag :itn)");

$my_Insert_Statement->bindParam(':nomc', $nom);
=======
$e = rand(1000000,9999999);
$nom = 'PEDIDO-' . $e;
$nomc = $_GET['nomeCliente']; 
$val = $_GET['total']; 
$itn = $_GET['itens'];
$obs = $_GET['observacoes']; 
$pag = $_GET['formaPagamento']; 

echo "nomc: " . $nomc . "<br>";
echo "nom: " . $nom . "<br>";
echo "itn: " . $itn . "<br>";
echo "obs: " . $obs . "<br>";
echo "pag: " . $pag . "<br>";

$my_Insert_Statement = $my_Db_Connection->prepare("INSERT INTO pedido (NomePedido, NomeCliente, Observacoes, Pagamento, Itens, Valor) VALUES (:nom, :nomc, :obs, :pag, :itn, :val)");

$my_Insert_Statement->bindParam(':nomc', $nomc);
>>>>>>> Stashed changes
$my_Insert_Statement->bindParam(':nom', $nom);
$my_Insert_Statement->bindParam(':obs', $obs);
$my_Insert_Statement->bindParam(':itn', $itn);
$my_Insert_Statement->bindParam(':pag', $pag);
<<<<<<< Updated upstream

if ($my_Insert_Statement->execute()) {
  echo "Sabor inserido com sucesso!!";
=======
$my_Insert_Statement->bindParam(':val', $val);

if ($my_Insert_Statement->execute()) {
  echo "<h1>Pedido Enviado com sucesso!!</h1>";
>>>>>>> Stashed changes
} else {
  echo "Deu RUIM!!!";
}
?>