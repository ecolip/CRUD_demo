<?php
header('Content-Type: application/json; charset=UTF8');
include('../../db.php');
require 'vendor/autoload.php';

try{
	$pdo = new PDO("mysql:host=$db[host];dbname=$db[dbname];port=$db[port];charset=$db[charset]", $db['username'],$db['password']);
} catch (PDOException $e) {
	echo "Database connection failed.".$e->getMessage();
	exit;
}

$orderPairs = $_POST['orderPair']; //$orderPairs =[{id:id, order:order}, {}, {}]
$sql = 'UPDATE todos SET `order`=:order WHERE `id`=:id';
$statement = $pdo->prepare($sql);
foreach ($orderPairs as $key=>$orderPair){
	// echo var_dump($orderPair);
	$statement->bindValue(':id', $orderPair['id'], PDO::PARAM_INT);
	$statement->bindValue(':order', $orderPair['order'], PDO::PARAM_INT);
	$result = $statement->execute();
}

if($result){
	echo 'success';
}
else{
	echo 'error';
}