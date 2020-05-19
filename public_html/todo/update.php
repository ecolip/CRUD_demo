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

$sql = 'UPDATE todos SET `content`=:content WHERE `id`=:id';
$statement = $pdo->prepare($sql);
$statement->bindValue(':id', $_POST['id'], PDO::PARAM_INT);
$statement->bindValue(':content', $_POST['content'], PDO::PARAM_STR);
$result = $statement->execute();

if($result){
	echo json_encode(['id' => $_POST['id']]);
}
else{
	print_r($pdo->errorInfo());
}