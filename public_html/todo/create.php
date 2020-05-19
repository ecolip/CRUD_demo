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

$sql = 'INSERT INTO todos (`content`, `is_complete`, `order`) VALUES(:content, :is_complete, :order)';
$statement = $pdo->prepare($sql);
$statement->bindValue(':content', $_POST['content'], PDO::PARAM_STR);
$statement->bindValue(':is_complete', 0, PDO::PARAM_INT);
$statement->bindValue(':order', $_POST['order'], PDO::PARAM_INT);
$result = $statement->execute();

if($result){
	echo json_encode(['id'=>$pdo->lastinsertid()]);
}
else{
	echo print_r($pdo->errorinfo());
}