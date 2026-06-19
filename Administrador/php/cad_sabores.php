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

$fla = $_POST['fla']; // ok
$nom = $_POST['nom']; // ok
$val = $_POST['val']; // ok
$img = $_POST['img'];
$res = $_POST['res']; // ok
$ing = $_POST['ing']; // ok

$my_Insert_Statement = $my_Db_Connection->prepare("INSERT INTO item (Nome, Valor, Imagem, Venda, Resumo, Igredientes, Tipo) VALUES (:nom, :val, :img, 1, :res, :ing, :fla)");

$my_Insert_Statement->bindParam(':nom', $nom);
$my_Insert_Statement->bindParam(':val', $val);
$my_Insert_Statement->bindParam(':img', $img);
$my_Insert_Statement->bindParam(':res', $res);
$my_Insert_Statement->bindParam(':ing', $ing);
$my_Insert_Statement->bindParam(':fla', $fla);

if ($my_Insert_Statement->execute()) {
  echo "Sabor inserido com sucesso!!";
} else {
  echo "Deu RUIM!!!";
}
?>