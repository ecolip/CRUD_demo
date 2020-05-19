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

//get is_complete value of id from mysql todo-list datadase
$sql= 'SELECT `is_complete` FROM todos WHERE id=:id';
$statement = $pdo->prepare($sql);
$statement->bindValue(':id', $_POST['id'], PDO::PARAM_INT);
$statement->execute();
$todo= $statement->fetch(PDO::FETCH_ASSOC);
// echo json_encode($todo); 

$sql = 'UPDATE todos SET is_complete=:is_complete WHERE id=:id';
$statement = $pdo->prepare($sql);
$statement->bindValue(':id', $_POST['id'], PDO::PARAM_INT);
$statement->bindValue(':is_complete', !$todo['is_complete'], PDO::PARAM_INT);
$result = $statement->execute();

if($result){
	echo json_encode(['id'=>$_POST['id'], 'is_complete'=>!$todo['is_complete']]);
}
else{
	echo $pdo->errorInfo();
}