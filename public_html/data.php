<?php
// header('Content-Type: application/json; charset=UTF8');
include('../db.php');

try{
	$pdo = new PDO("mysql:host=$db[host];dbname=$db[dbname];port=$db[port];charset=$db[charset]", $db['username'],$db['password']);
} catch (PDOException $e) {
	echo "Database connection failed.".$e->getMessage();
	exit;
}

$sql = 'SELECT * FROM todos ORDER BY `order` ASC';
$statement = $pdo->prepare($sql);
$statement->execute();
$todos = $statement->fetchAll(PDO::FETCH_ASSOC);
// echo var_dump($todos);
// echo json_encode($todos, JSON_NUMERIC_CHECK); //字串在js都被判定為true，故保留數字格式
?>
<script>
	var $todos = <?= json_encode($todos, JSON_NUMERIC_CHECK)?>;
</script>