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

$nom = 'PEDIDO-' + rand(1000000,9999999);
$nomc = $_POST['nomc']; 
$itn = $_POST['itn'];
$obs = $_POST['obs']; 
$pag = $_POST['pag']; 

$my_Insert_Statement = $my_Db_Connection->prepare("INSERT INTO pedido (NomePedido, NomeCliente, Observacoes, Pagamento, Itens) VALUES (:nom, :nomc, :obs, :pag :itn)");

$my_Insert_Statement->bindParam(':nomc', $nom);
$my_Insert_Statement->bindParam(':nom', $nom);
$my_Insert_Statement->bindParam(':obs', $obs);
$my_Insert_Statement->bindParam(':itn', $itn);
$my_Insert_Statement->bindParam(':pag', $pag);

if ($my_Insert_Statement->execute()) {
  echo "Sabor inserido com sucesso!!";
} else {
  echo "Deu RUIM!!!";
}
?>